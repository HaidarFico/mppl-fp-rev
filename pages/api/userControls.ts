import { PrismaClient } from "@prisma/client";

export async function registerNewUser(
  nama: string,
  email: string,
  telepon: string,
  biodata: string,
  password: string
) {
  // Check for constraints
  const prisma = new PrismaClient();
  if (
    nama.length > 150 ||
    email.length > 50 ||
    telepon.length > 25 ||
    biodata.length > 255 ||
    password.length > 50
  ) {
    throw new Error("invalid arguments");
  }
  if (
    (await prisma.pelanggan.findFirst({
      where: {
        P_EMAIL: email,
      },
    })) != null
  ) {
    throw new Error("email already exists");
  }
  if (!checkEmail(email)) {
    throw new Error("invalid email");
  }
  // if(!checkPhoneNumber(telepon)){
  //   throw new Error('invalid phone number');
  // }
  const id = await prisma.pelanggan.count();
  const query = await prisma.pelanggan.create({
    data: {
      P_ID: id,
      P_NAMA: nama,
      P_EMAIL: email,
      P_TLP: telepon,
      P_BIO: biodata,
      P_PASSWORD: password,
    },
  });

  return query;
}

export async function loginUser(email: string, password: string) {
  const prisma = new PrismaClient();
  if (email.length > 150 || password.length > 50) {
    throw new Error("email and password invalid");
  }

  const query = await prisma.pelanggan.findFirst({
    where: {
      P_EMAIL: email,
      P_PASSWORD: password,
    },
  });
  if (query == null) {
    throw new Error("Wrong username/password");
  }

  return query;
}

export async function registerNewAuthor(
  nama: string,
  email: string,
  telepon: string,
  biodata: string,
  password: string
) {
  const prisma = new PrismaClient();
  if (
    nama.length > 150 ||
    email.length > 50 ||
    telepon.length > 25 ||
    biodata.length > 255 ||
    password.length > 50
  ) {
    throw new Error("invalid arguments");
  }
  if (
    (await prisma.seniman.findFirst({
      where: {
        S_EMAIL: email,
      },
    })) != null
  ) {
    throw new Error("email already exists");
  }
  if (!checkEmail(email)) {
    throw new Error("invalid email");
  }
  // if(!checkPhoneNumber(telepon)){
  //   throw new Error('invalid phone number');
  // }
  const id = await prisma.seniman.count();
  const query = await prisma.seniman.create({
    data: {
      S_ID: id,
      S_NAMA: nama,
      S_EMAIL: email,
      S_TLP: telepon,
      S_BIO: biodata,
      S_PASSWORD: password,
    },
  });

  return query;
}

export async function loginAuthor(email: string, password: string) {
  const prisma = new PrismaClient();
  if (email.length > 150 || password.length > 50) {
    throw new Error("email and password invalid");
  }

  const query = await prisma.seniman.findFirst({
    where: {
      S_EMAIL: email,
      S_PASSWORD: password,
    },
  });
  if (query == null) {
    throw new Error("Wrong username/password");
  }

  return query;
}

export async function createNewListing(
  deskripsi: string,
  harga: number,
  judul: string,
  kategoriID: number,
  senimanID: number
) {
  const prisma = new PrismaClient();
  // Check for constraints
  if (
    deskripsi.length > 255 ||
    typeof harga != "number" ||
    judul.length > 255
  ) {
    throw new Error("invalid arguments");
  }
  if (
    (await prisma.kategori.findUnique({ where: { K_ID: kategoriID } })) == null
  )
    throw new Error("invalid kategoriID");
  if ((await prisma.seniman.findUnique({ where: { S_ID: senimanID } })) == null)
    throw new Error("invalid senimanID");

  const id = await prisma.jasa_karya.count();
  const query = await prisma.jasa_karya.create({
    data: {
      JK_ID: id,
      JK_DESKRIPSI: deskripsi,
      JK_HARGA: harga,
      JK_JUDUL: judul,
      Kategori_K_ID: kategoriID,
      Seniman_S_ID: senimanID,
    },
  });
  return query;
}

export async function setTransactionStatus(
  transactionId: number,
  transactionStatusCode: number
) {
  // CODE 0 = blm bayar, 1 = diproses, 2 = jadi, 3 = revisi, 4 = pengiriman, 5 = selesai
  if (transactionStatusCode < 0 || transactionStatusCode > 5) {
    throw new Error("transactionStatusCode invalid");
  }

  const prisma = new PrismaClient();
  const query = await prisma.transaksi.findUnique({
    where: {
      T_ID: transactionId,
    },
  });
  if (query == null) {
    throw new Error("query failed");
  }

  return query;
}

export async function Checkout(transactionId: number) {
  const checkoutCode = await setTransactionStatus(transactionId, 0).catch(
    function (err) {
      throw err;
    }
  );

  return checkoutCode;
}

export async function loginAdmin(email: string, password: string) {
  const prisma = new PrismaClient();
  if (email.length > 150 || password.length > 50) {
    throw new Error("email and password invalid");
  }

  const query = await prisma.admin.findFirst({
    where: {
      A_EMAIL: email,
      A_PASSWORD: password,
    },
  });
  if (query == null) {
    throw new Error("Wrong username/password");
  }

  return query;
}

export function checkEmail(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

export function checkPhoneNumber(phoneNumber: string) {
  const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return regex.test(phoneNumber);
}
