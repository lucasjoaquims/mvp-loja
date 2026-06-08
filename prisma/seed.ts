import { PrismaClient, Role, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@loja.com" },
    update: {},
    create: {
      email: "admin@loja.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Categories
  const categories = [
    { name: "Camisetas", slug: "camisetas", description: "Camisetas premium", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { name: "Calças", slug: "calcas", description: "Calças e jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80" },
    { name: "Tênis", slug: "tenis", description: "Calçados esportivos", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
    { name: "Acessórios", slug: "acessorios", description: "Acessórios e complementos", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
    { name: "Moletons", slug: "moletons", description: "Moletons e hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80" },
    { name: "Vestidos", slug: "vestidos", description: "Vestidos e saias", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  // Products
  const products = [
    {
      name: "Camiseta Essencial Branca",
      slug: "camiseta-essencial-branca",
      description: "Camiseta de algodão premium, corte regular, acabamento superior.",
      price: 89.90,
      comparePrice: 119.90,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Branco", "Preto", "Cinza"],
      stock: 50,
      featured: true,
      categorySlug: "camisetas",
    },
    {
      name: "Camiseta Oversized Preta",
      slug: "camiseta-oversized-preta",
      description: "Camiseta oversized com fit moderno e tecido de alta qualidade.",
      price: 109.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Preto", "Branco"],
      stock: 35,
      featured: true,
      categorySlug: "camisetas",
    },
    {
      name: "Camiseta Gráfica Urban",
      slug: "camiseta-grafica-urban",
      description: "Design exclusivo com estampa urban, tecido premium.",
      price: 129.90,
      comparePrice: 159.90,
      images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"],
      sizes: ["P", "M", "G"],
      colors: ["Preto", "Azul"],
      stock: 20,
      featured: false,
      categorySlug: "camisetas",
    },
    {
      name: "Calça Slim Preta",
      slug: "calca-slim-preta",
      description: "Calça slim fit em tecido premium, extremamente confortável.",
      price: 249.90,
      comparePrice: 299.90,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"],
      sizes: ["36", "38", "40", "42", "44"],
      colors: ["Preto", "Azul escuro"],
      stock: 30,
      featured: true,
      categorySlug: "calcas",
    },
    {
      name: "Calça Cargo Utilitária",
      slug: "calca-cargo-utilitaria",
      description: "Cargo com múltiplos bolsos, estilo streetwear autêntico.",
      price: 279.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"],
      sizes: ["38", "40", "42", "44"],
      colors: ["Verde militar", "Preto", "Bege"],
      stock: 25,
      featured: false,
      categorySlug: "calcas",
    },
    {
      name: "Tênis Runner Pro",
      slug: "tenis-runner-pro",
      description: "Tênis de corrida com tecnologia de amortecimento avançada.",
      price: 399.90,
      comparePrice: 499.90,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      colors: ["Branco", "Preto", "Vermelho"],
      stock: 40,
      featured: true,
      categorySlug: "tenis",
    },
    {
      name: "Tênis Clássico Couro",
      slug: "tenis-classico-couro",
      description: "Tênis clássico em couro legítimo, atemporal e elegante.",
      price: 349.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80"],
      sizes: ["37", "38", "39", "40", "41", "42"],
      colors: ["Branco", "Preto"],
      stock: 20,
      featured: true,
      categorySlug: "tenis",
    },
    {
      name: "Relógio Minimalista",
      slug: "relogio-minimalista",
      description: "Relógio de design minimalista, pulseira em couro italiano.",
      price: 599.90,
      comparePrice: 749.90,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"],
      sizes: ["Único"],
      colors: ["Preto", "Prata", "Dourado"],
      stock: 15,
      featured: true,
      categorySlug: "acessorios",
    },
    {
      name: "Boné Estruturado",
      slug: "bone-estruturado",
      description: "Boné com estrutura firme e bordado premium.",
      price: 119.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80"],
      sizes: ["Único"],
      colors: ["Preto", "Branco", "Cinza"],
      stock: 45,
      featured: false,
      categorySlug: "acessorios",
    },
    {
      name: "Bolsa Crossbody Urbana",
      slug: "bolsa-crossbody-urbana",
      description: "Bolsa crossbody compacta, ideal para o dia a dia urbano.",
      price: 229.90,
      comparePrice: 289.90,
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80"],
      sizes: ["Único"],
      colors: ["Preto", "Marrom"],
      stock: 18,
      featured: false,
      categorySlug: "acessorios",
    },
    {
      name: "Moletom Essencial",
      slug: "moletom-essencial",
      description: "Moletom com capuz, fleece interno super macio.",
      price: 199.90,
      comparePrice: 259.90,
      images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80"],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Cinza", "Preto", "Azul navy"],
      stock: 35,
      featured: true,
      categorySlug: "moletons",
    },
    {
      name: "Moletom Zip Premium",
      slug: "moletom-zip-premium",
      description: "Moletom com zíper frontal, acabamento premium.",
      price: 229.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80"],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Preto", "Cinza escuro"],
      stock: 22,
      featured: false,
      categorySlug: "moletons",
    },
    {
      name: "Vestido Midi Clássico",
      slug: "vestido-midi-classico",
      description: "Vestido midi de linha, elegante e versátil para qualquer ocasião.",
      price: 299.90,
      comparePrice: 379.90,
      images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"],
      sizes: ["PP", "P", "M", "G"],
      colors: ["Preto", "Branco", "Nude"],
      stock: 20,
      featured: true,
      categorySlug: "vestidos",
    },
    {
      name: "Vestido Casual Floral",
      slug: "vestido-casual-floral",
      description: "Vestido casual com estampa floral delicada, perfeito para o verão.",
      price: 249.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80"],
      sizes: ["PP", "P", "M", "G", "GG"],
      colors: ["Azul floral", "Rosa floral"],
      stock: 28,
      featured: false,
      categorySlug: "vestidos",
    },
    {
      name: "Camiseta Polo Piquet",
      slug: "camiseta-polo-piquet",
      description: "Polo clássica em piquet, acabamento refinado.",
      price: 149.90,
      comparePrice: 189.90,
      images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80"],
      sizes: ["P", "M", "G", "GG"],
      colors: ["Branco", "Azul", "Vermelho", "Preto"],
      stock: 40,
      featured: false,
      categorySlug: "camisetas",
    },
    {
      name: "Tênis Skate Low",
      slug: "tenis-skate-low",
      description: "Tênis baixo inspirado na cultura skate, sola durável.",
      price: 279.90,
      comparePrice: 349.90,
      images: ["https://images.unsplash.com/photo-1556906781-9a412961d28e?w=600&q=80"],
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      colors: ["Preto", "Branco", "Cinza"],
      stock: 33,
      featured: false,
      categorySlug: "tenis",
    },
    {
      name: "Calça Jeans Skinny",
      slug: "calca-jeans-skinny",
      description: "Jeans skinny com lavagem premium e elastano para conforto.",
      price: 219.90,
      comparePrice: 269.90,
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"],
      sizes: ["36", "38", "40", "42"],
      colors: ["Azul", "Preto", "Cinza"],
      stock: 28,
      featured: false,
      categorySlug: "calcas",
    },
    {
      name: "Óculos Aviador",
      slug: "oculos-aviador",
      description: "Óculos de sol no estilo aviador, lente polarizada UV400.",
      price: 189.90,
      comparePrice: 249.90,
      images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"],
      sizes: ["Único"],
      colors: ["Dourado", "Prata", "Preto"],
      stock: 22,
      featured: false,
      categorySlug: "acessorios",
    },
    {
      name: "Moletom Cropped",
      slug: "moletom-cropped",
      description: "Moletom cropped feminino, tendência do streetwear atual.",
      price: 179.90,
      comparePrice: null,
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"],
      sizes: ["P", "M", "G"],
      colors: ["Rosa", "Branco", "Preto"],
      stock: 30,
      featured: false,
      categorySlug: "moletons",
    },
    {
      name: "Vestido Slip Dress",
      slug: "vestido-slip-dress",
      description: "Slip dress elegante, perfeito para festas e eventos sociais.",
      price: 329.90,
      comparePrice: 399.90,
      images: ["https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80"],
      sizes: ["PP", "P", "M", "G"],
      colors: ["Bege", "Preto", "Vinho"],
      stock: 15,
      featured: true,
      categorySlug: "vestidos",
    },
  ];

  for (const product of products) {
    const { categorySlug, ...data } = product;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoryId: createdCategories[categorySlug],
      },
    });
  }

  // Coupons
  const coupons = [
    { code: "BEMVINDO10", type: CouponType.PERCENTAGE, value: 10, minAmount: 150, maxUses: 100 },
    { code: "FRETE20", type: CouponType.FIXED, value: 20, minAmount: 200, maxUses: 50 },
    { code: "VIP25", type: CouponType.PERCENTAGE, value: 25, minAmount: 500, maxUses: 20 },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }

  // Banners
  const banners = [
    {
      title: "Nova Coleção 2025",
      subtitle: "Descubra peças exclusivas com design premium",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80",
      link: "/produtos",
      active: true,
      order: 1,
    },
    {
      title: "Até 40% OFF",
      subtitle: "Aproveite nossas promoções por tempo limitado",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
      link: "/produtos?promo=true",
      active: true,
      order: 2,
    },
    {
      title: "Edição Limitada",
      subtitle: "Peças únicas para quem busca o extraordinário",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=80",
      link: "/produtos?novidades=true",
      active: true,
      order: 3,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: `banner-${banner.order}` },
      update: {},
      create: { id: `banner-${banner.order}`, ...banner },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
