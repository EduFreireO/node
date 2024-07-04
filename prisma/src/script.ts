import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/*
  Qual a diferença entre Type e Interface?. 
  Eu saquei que uma Interface pode modelar objetos, mas o Type já nao faz a mesma coisa?
*/
type User = {
  name: string;
  email: string;
  isAdmin: boolean;
  emailUpdates: boolean;
};

type Post = {
  title: string;
  rating: number;
  authorId: string;
};
async function createUser({ name, email, isAdmin, emailUpdates }: User) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      isAdmin,
      userPreferences: {
        create: { emailUpdates },
      },
    },
  });
  return user;
}
async function selectUsers({ name, email, isAdmin, emailUpdates }: User) {
  const user = await prisma.user.findMany({
    where: {
      name: "eduardo",
      email: { contains: "@email" }, // Contains -> Similar ao Like no Mysql
    },
  });
  console.log(user);
}
async function insertPost(
  { title, rating, authorId }: Post,
  categoryName: string
) {
  const post = await prisma.post.create({
    data: {
      title,
      rating,
      authorId,
      category: {
        create: { name: categoryName },
      },
    },
  });
}
async function selectPostsWithRateGreaterThan5() {
  const posts = await prisma.post.findMany({
    where: {
      rating: { gt: 5 },
    },
    select: { id: true },
  });
  console.log(posts);
}

async function averageRating() {
  const avg = await prisma.post.aggregate({
    _avg: { rating: true },
  });
  console.log(avg._avg.rating);
}
const user: User = {
  name: "eduardo",
  email: "Teste@email2",
  isAdmin: false,
  emailUpdates: false,
};

async function getIdSomeUser() {
  const id = await prisma.user.findFirst({ select: { id: true } });
  return id;
}

getIdSomeUser().then((data) => {
  const post: Post = {
    title: "Teste2",
    rating: 6,
    authorId: data?.id,
  };
  const insertedPost = insertPost(post, "TesteCaregory2");
});

getIdSomeUser().then((data) => console.log(data, "ID: USER"));
/*
  Existe alguma forma de recuperar esse Id sem precisar usar esse then da linha acima?
    Gostaria de fazer algo do tipo:
      const userId = getIdSomeUser(); 
  Mas a função esta retornando uma Promise que fica Pending, achava que o await esperava a promise ser resolvida para só depois permitir o fluxo normal do código ser executado.    
*/
async function getSumRating() {
  const sum = await prisma.post.aggregate({
    _sum: { rating: true },
  });
  console.log(sum);
}
getSumRating();
