import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = JSON.parse(process.env.FIREBASE_ADMINSDK_JSON || "{}");

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig as any),
  });
}

const db = getFirestore();

const BASE_36_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

export class FireStore {
  collectionId: string;

  constructor(collectionId: string) {
    this.collectionId = collectionId;
  }

  save = async (createDto: object) => {
    const nextId = await this.getNextId();
    const schemasRef = db.collection("schemas");
    await schemasRef.doc(nextId).set({
      ...createDto,
      createdAt: new Date(),
    });
    return nextId;
  };

  find = async () => {
    const schemasRef = db.collection(this.collectionId);
    const snapshot = await schemasRef.orderBy("createdAt", "desc").get();
    const schemas = [] as any[];
    snapshot.forEach((doc) => {
      schemas.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return schemas;
  };

  findOne = async (docId: string) => {
    if (!docId) {
      throw "Id empty!";
    }

    const schemasRef = db.collection(this.collectionId);
    const snapshot = await schemasRef.doc(docId).get();
    if (!snapshot.exists) {
      throw "data not exists!";
    }

    return snapshot.data();
  };

  private toBase63(num: number) {
    let base63 = "";
    while (num > 0) {
      base63 = BASE_36_CHARS[num % BASE_36_CHARS.length] + base63;
      num = Math.floor(num / BASE_36_CHARS.length);
    }
    return base63 || "0";
  }

  private async getNextId() {
    const counterRef = db
      .collection(`${this.collectionId}-counters`)
      .doc("idCounter");
    const result = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let currentCount;
      if (!counterDoc.exists) {
        currentCount = 1;
        transaction.set(counterRef, { count: currentCount });
      } else {
        currentCount = (counterDoc.data()?.count || 0) + 1;
        transaction.update(counterRef, { count: currentCount });
      }
      return currentCount;
    });

    return this.toBase63(result);
  }
}
