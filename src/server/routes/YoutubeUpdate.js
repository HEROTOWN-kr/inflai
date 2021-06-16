const Youtube = require('../models').TB_YOUTUBE;
const { YoutubeDataRequest } = require('../config/common');

async function Update() {
  try {
    const dbData = await Youtube.findAll({
      attributes: ['YOU_ID', 'INF_ID', 'YOU_TOKEN', 'YOU_NAME', 'YOU_STATUS', 'YOU_DT'],
    });

    const PromiseArray = dbData.map(item => new Promise((async (resolve, reject) => {
      try {
        const { YOU_ID, INF_ID, YOU_TOKEN } = item;
        const youtubeChannelData = await YoutubeDataRequest(YOU_TOKEN, YOU_ID);
        if (youtubeChannelData.error) {
          resolve({ YOU_ID: youtubeChannelData.YOU_ID, error: 'error' });
        } else {
          const channelId = youtubeChannelData.id;
          const { viewCount, subscriberCount } = youtubeChannelData.statistics;
          const { title, description } = youtubeChannelData.snippet;
          resolve({
            YOU_ID, viewCount, subscriberCount, title, description
          });
        }
      } catch (e) {
        resolve('error');
      }
    })));

    const promiseData = await Promise.all(PromiseArray);

    const UpdatePromise = promiseData.map(item => new Promise((async (resolve, reject) => {
      if (item.error) {
        await Youtube.update({ YOU_STATUS: 0 }, {
          where: { YOU_ID: item.YOU_ID }
        });
        resolve('not updated');
      } else {
        const {
          title, subscriberCount, viewCount, YOU_ID
        } = item;
        await Youtube.update({
          YOU_NAME: title,
          YOU_SUBS: subscriberCount,
          YOU_VIEWS: viewCount,
          YOU_UPD_DATE: new Date()
        }, {
          where: { YOU_ID }
        });
        resolve('updated');
      }
    })));

    const updateAll = await Promise.all(UpdatePromise);
    console.log(updateAll);
  } catch (err) {
    console.log(err.message);
  }
}

Update();
