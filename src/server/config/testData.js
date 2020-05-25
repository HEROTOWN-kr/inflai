(function (global) {
  'use strict;';

  // Class ------------------------------------------------
  const testData = {};

  testData.instaAccounts = [
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80',
      username: 'RbnRaw',
      name: '김서웅',
      followers_count: '257',
      INF_ID: 4,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Robert',
      name: '박여운',
      followers_count: '1566',
      INF_ID: 22,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1542728498-09c6a1af7cb9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      username: 'Farid',
      name: '최여훈',
      followers_count: '2653',
      INF_ID: 23,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80',
      username: 'Houcine',
      name: '문승리',
      followers_count: '9666',
      INF_ID: 48,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1549068106-b024baf5062d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Lucas',
      name: '박이솔',
      followers_count: '15254',
      INF_ID: 49,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
      username: 'Amir',
      name: '김진후',
      followers_count: '26325',
      INF_ID: 54,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1545912453-db258ca9b7b7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Valerie',
      name: '유서후',
      followers_count: '36235',
      INF_ID: 1,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1569124589354-615739ae007b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      username: 'Ilinerwise',
      name: '문희원',
      followers_count: '750',
      INF_ID: 2,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=656&q=80',
      username: 'Reza Biazar',
      name: '황찬세',
      followers_count: '150213',
      INF_ID: 3,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Harishan Kobalasingam',
      name: '김예준',
      followers_count: '3533',
      INF_ID: 6,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1565260524775-7e9b536fba2f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
      username: 'Pantian Punpuang',
      name: '박현우',
      followers_count: '65235',
      INF_ID: 5,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1547624643-3bf761b09502?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Sebastian Hemetsberger',
      name: '김지호',
      followers_count: '23633',
      INF_ID: 7,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1546820389-44d77e1f3b31?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80',
      username: 'Jake_Fagan',
      name: '최준우',
      followers_count: '12856',
      INF_ID: 8,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?ixlib=rb-1.2.1&auto=format&fit=crop&w=564&q=80',
      username: 'Arshd_Khad',
      name: '문시우',
      followers_count: '19652',
      INF_ID: 9,
    },
    {
      profile_picture_url: 'https://images.unsplash.com/photo-1530512728528-123933595874?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      username: 'Roberto_Delgado',
      name: '김민준',
      followers_count: '26542',
      INF_ID: 10,
    },
  ];

  // Exports ----------------------------------------------
  module.exports = testData;
}((this || 0).self || global));
