export const navigation = {
  categories: [
    {
      id: "category",
      name: "Categories",
      featured: [
       {
            name: 'Demon Slayer merchandise',
            href: '/',
            imageSrc: 'https://static0.srcdn.com/wordpress/wp-content/uploads/2024/10/demon-slayer-roar-of-victory-poster.jpg',
            imageAlt: 'Demon Slayer',
          },
          {
            name: 'One piece merchandise',
            href: '/',
            imageSrc: 'https://wallpapers.com/images/hd/one-piece-cool-jo1cjbe06e9iewqh.jpg',
            imageAlt: 'One Piece',
          },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Anime", id: "anime", href: "/category/clothing/anime" },
            { name: "Quotes", id: "quotes", href: "/category/clothing/quotes" },
            { name: "Comics", id: "comics", href: "/category/clothing/comics" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", id: "watch", href: "/category/accessories/watch" },
            { name: "Wallets", id: "wallet", href: "/category/accessories/wallet" },
            { name: "Bags", id: "bag", href: "/category/accessories/bag" },
            { name: "Sunglasses", id: "sunglasses", href: "/category/accessories/sunglasses" },
            { name: "Hats", id: "hat", href: "/category/accessories/hat" },
            { name: "Belts", id: "belt", href: "/category/accessories/belt" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};
