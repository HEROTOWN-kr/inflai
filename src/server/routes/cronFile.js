const { getInstagramMediaData, getInstagramData } = require('../config/common');
const Influencer = require('../models').TB_INFLUENCER;
const Insta = require('../models').TB_INSTA;
const Admin = require('../models').TB_ADMIN;

async function Update() {
  // const InstaCount = await Instagram.count();
  // console.log(InstaCount);
  const date = new Date();
  const timestamp = date.getTime();


  try {
    const instaInfo = await Insta.findAll();

    const instaData = await Promise.all(
      instaInfo.map(async (iData) => {
        const { INF_ID, INS_ACCOUNT_ID, INS_TOKEN } = iData;
        // const { INF_ID, INF_INST_ID, INF_TOKEN } = iData;
        try {
          const accountData = await getInstagramData(INS_ACCOUNT_ID, INS_TOKEN);
          const mediaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);

          const statistics = mediaData.reduce((acc, el) => ({
            likeSum: (acc.likeSum || 0) + el.like_count,
            commentsSum: (acc.commentsSum || 0) + el.comments_count,
          }), {});

          return {
            INF_ID, INS_TOKEN, ...accountData, ...statistics
          };
        } catch (error) {
          return { INF_ID, error };
        }
      })
    );

    const updatedArray = await Promise.all(
      instaData.map(async (iData) => {
        const {
          INF_ID, INF_TOKEN, likeSum, commentsSum, followers_count, follows_count, media_count, username, profile_picture_url, name, id, error
        } = iData;
        if (error) {
          return { INF_ID, message: 'not updated' };
        }

        try {
          const result = await Insta.upsert({
            INF_ID,
            INS_TOKEN: INF_TOKEN,
            INS_ACCOUNT_ID: id,
            INS_NAME: name.normalize('NFC'),
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_FLWR: followers_count,
            INS_FLW: follows_count,
            INS_PROFILE_IMG: profile_picture_url,
            INS_LIKES: likeSum,
            INS_CMNT: commentsSum
          });
          return { INF_ID, message: result ? 'inserted' : 'updated' };
        } catch (err) {
          return {
            INF_ID,
            name,
            message: err.message,
            query: err.sql
          };
        }
      })
    );

    console.log(updatedArray);

    Admin.update({ ADM_UPDATE_DT: timestamp }, {
      where: { ADM_ID: 1 }
    });
  } catch (err) {
    console.log(err.message);
  }
}

Update();
