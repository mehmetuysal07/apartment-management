const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Veritabanını temizle
    await prisma.user.deleteMany({});

    // Yeni kullanıcı oluştur
    const hashedPassword = await bcrypt.hash('1234', 10);
    const user = await prisma.user.create({
      data: {
        username: 'memoli',
        password: hashedPassword,
        name: 'Mehmet',
        role: 'admin'
      }
    });

    console.log('Kullanıcı başarıyla oluşturuldu:', {
      username: user.username,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('Hata:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 