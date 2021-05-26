const express = require('express');
const request = require('request');
const fs = require('fs');
const fetch = require('node-fetch');
const vision = require('@google-cloud/vision');
const Sequelize = require('sequelize');
const config = require('../config/config');
const Influencer = require('../models').TB_INFLUENCER;
const Instagram = require('../models').TB_INSTA;
const common = require('../config/common');
const category = require('../config/detectCategory');

const isoCountries = {
  AF: 'Afghanistan',
  AX: 'Aland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua And Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia And Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, Democratic Republic',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: 'Cote D\'Ivoire',
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island & Mcdonald Islands',
  VA: 'Holy See (Vatican City State)',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic Of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle Of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KR: 'Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Lao People\'s Democratic Republic',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States Of',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  BL: 'Saint Barthelemy',
  SH: 'Saint Helena',
  KN: 'Saint Kitts And Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin',
  PM: 'Saint Pierre And Miquelon',
  VC: 'Saint Vincent And Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome And Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia And Sandwich Isl.',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard And Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad And Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks And Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Viet Nam',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis And Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe'
};


const { Op } = Sequelize;
const {
  getInstagramMediaData,
  getInstagramData,
  getInstagramInsights,
  getIdFromToken,
  getFacebookLongToken,
  getInstagramBusinessAccounts,
  checkLocalHost
} = require('../config/common');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = req.query;
    const {
      orderBy, direction, searchWord
    } = data;

    const page = parseInt(data.page, 10);
    const limit = parseInt(data.limit, 10);
    const offset = (page - 1) * limit;

    const options = {
      where: {},
      attributes: [
        'INS_ID',
        'INF_ID',
        'INS_NAME',
        'INS_USERNAME',
        'INS_MEDIA_CNT',
        'INS_FLW',
        'INS_FLWR',
        'INS_PROFILE_IMG',
        'INS_LIKES',
        'INS_CMNT',
        'INS_TYPES',
      ],
      include: [
        {
          model: Influencer,
          attributes: ['INF_NAME'],
          where: {}
        },
      ],
      limit,
      offset,
      order: [[orderBy, direction]]
    };

    const CountOptions = {
      where: {},
      include: [
        {
          model: Influencer,
          attributes: ['INF_NAME'],
          where: {}
        },
      ],
    };

    if (searchWord) {
      options.where = {
        [Op.or]: [
          { INS_NAME: { [Op.like]: `%${searchWord}%` } },
          { INS_USERNAME: { [Op.like]: `%${searchWord}%` } },
          { INS_TYPES: { [Op.like]: `%${searchWord}%` } },
          { '$TB_INFLUENCER.INF_NAME$': { [Op.like]: `%${searchWord}%` } }
        ],
      };
      CountOptions.where = {
        [Op.or]: [
          { INS_NAME: { [Op.like]: `%${searchWord}%` } },
          { INS_USERNAME: { [Op.like]: `%${searchWord}%` } },
          { INS_TYPES: { [Op.like]: `%${searchWord}%` } },
          { '$TB_INFLUENCER.INF_NAME$': { [Op.like]: `%${searchWord}%` } }
        ],
      };
    }

    const dbData = await Instagram.findAll(options);
    const InstaCount = await Instagram.count(CountOptions);

    /* let iCount = InstaCount - 1;

    for (let i = 0; i < dbData.length; i++) {
      dbData[i].dataValues.rownum = InstaCount - offset - (iCount--);
    } */

    const InstagramAccounts = dbData.map((item, index) => {
      const { dataValues } = item;
      const rownum = offset + index + 1;
      return { ...dataValues, rownum };
    });

    res.status(200).json({
      data: { list: InstagramAccounts, cnt: InstaCount },
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/getGoogleData', async (req, res) => {
  const { INS_ID, host } = req.query;
  const { detectCategory } = category;
  const isLocal = checkLocalHost(host);

  const filePath = isLocal ? {
    keyFileName: 'src/server/config/googleVisionKey.json',
    imagePath: './src/server/img/image'
  } : {
    keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
    imagePath: '../server/img/image'
  };

  const options = {
    where: { INS_ID },
    attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
  };

  const InstaData = await Instagram.findOne(options);
  const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

  const client = new vision.ImageAnnotatorClient({
    keyFilename: filePath.keyFileName
  });

  const colors = [
    '#FF835D', '#409CFF', '#52D726', '#FF0000',
    '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
    '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
    '#B276B2', '#DECF3F', '#81726A', '#270722',
    '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
    '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
    '#7CDDDD'
  ];
  // '#52D726', '#FFEC00',

  async function detectPic(index) {
    const fileName = `${filePath.imagePath}${index}.jpg`;
    const [result] = await client.labelDetection(fileName);
    const labels = result.labelAnnotations;

    return new Promise(((resolve, reject) => {
      if (labels && labels[0]) {
        const { score, description } = labels[0];

        const name = detectCategory.reduce((acc, item) => {
          const wordExist = (item.categories.indexOf(description) > -1);
          if (wordExist) acc.description = item.name;
          return acc;
        }, { score, description });

        resolve(name);
      }
      resolve({});
    }));
  }

  async function downloadAndDetect(fileUrl, index) {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    const path = `${filePath.imagePath}${index}.jpg`;

    return new Promise((async (resolve, reject) => {
      fs.writeFile(path, buffer, async () => {
        const detectResult = await detectPic(index);
        resolve(detectResult);
      });
    }));
  }

  try {
    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);
    const gDatas = await Promise.all(
      instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const detectData = await downloadAndDetect(fileUrl, index);
        return { ...mediaInfo, ...detectData };
      })
    );

    const statistics = gDatas.reduce((acc, el) => {
      acc[el.description] = {
        count: (acc[el.description] && acc[el.description].count || 0) + 1,
        likeCountSum: (acc[el.description] && acc[el.description].likeCountSum || 0) + el.like_count,
        commentsCountSum: (acc[el.description] && acc[el.description].comments_count || 0) + el.comments_count,
      };
      return acc;
    }, {});

    const finalArray = Object.keys(statistics).map((key, index) => {
      statistics[key].value = Math.round(100 / (gDatas.length / statistics[key].count));
      return { ...statistics[key], description: key, color: colors[index] };
    });

    finalArray.sort((a, b) => b.value - a.value);

    const INS_TYPES = finalArray.reduce((acc, el) => {
      acc.push(el.description);
      return acc;
    }, []);

    Instagram.update({ INS_TYPES: INS_TYPES.join(' ') }, {
      where: { INS_ID }
    });

    res.json({
      code: 200,
      statistics: finalArray,
    });
  } catch (err) {
    res.json({
      code: 400,
      message: err,
    });
  }
});

router.get('/getGoogleDataObject', async (req, res) => {
  try {
    const { INS_ID, host } = req.query;
    const { detectCategory } = category;
    const isLocal = checkLocalHost(host);
    const filePath = isLocal ? {
      keyFileName: 'src/server/config/googleVisionKey.json',
      imagePath: './src/server/img/image'
    } : {
      keyFileName: '/data/inflai/src/server/config/googleVisionKey.json',
      imagePath: '../server/img/image'
    };

    const options = {
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const client = new vision.ImageAnnotatorClient({
      keyFilename: filePath.keyFileName
    });

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];
    // '#52D726', '#FFEC00',


    async function detectPic(index) {
      const fileName = `${filePath.imagePath}${index}.jpg`;
      const [result] = await client.objectLocalization(fileName);

      const objects = result.localizedObjectAnnotations;

      if (objects.length > 0) {
        const { name, score } = objects[0];

        const returnObj = detectCategory.reduce((acc, item) => {
          const wordExist = (item.categories.indexOf(name) > -1);
          if (wordExist) acc.name = item.name;
          return acc;
        }, { score, name });

        return new Promise(((resolve, reject) => {
          resolve(returnObj);
        }));
      }
      const [result2] = await client.labelDetection(fileName);
      const labels = result2.labelAnnotations;
      return new Promise(((resolve, reject) => {
        if (labels && labels[0]) {
          const { score, description } = labels[0];
          const name = detectCategory.reduce((acc, item) => {
            const wordExist = (item.categories.indexOf(description) > -1);
            if (wordExist) acc.name = item.name;
            return acc;
          }, { score, name: description });

          resolve(name);
        }
        resolve({});
      }));
    }

    async function downloadAndDetect(fileUrl, index) {
      const response = await fetch(fileUrl);
      const buffer = await response.buffer();
      const path = `${filePath.imagePath}${index}.jpg`;

      return new Promise((async (resolve, reject) => {
        fs.writeFile(path, buffer, async () => {
          const detectResult = await detectPic(index);
          resolve(detectResult);
        });
      }));
    }

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);
    const gDatas = await Promise.all(
      instaData.map(async (mediaInfo, index) => {
        const { thumbnail_url, media_url } = mediaInfo;
        const fileUrl = thumbnail_url || media_url;
        const detectData = await downloadAndDetect(fileUrl, index);
        return { ...mediaInfo, ...detectData };
      })
    );

    const statistics = gDatas.reduce((acc, el) => {
      acc[el.name] = {
        count: (acc[el.name] && acc[el.name].count || 0) + 1,
        likeCountSum: (acc[el.name] && acc[el.name].likeCountSum || 0) + el.like_count,
        commentsCountSum: (acc[el.name] && acc[el.name].comments_count || 0) + el.comments_count,
      };
      return acc;
    }, {});

    const finalArray = Object.keys(statistics).map((key, index) => {
      statistics[key].value = Math.round(100 / (gDatas.length / statistics[key].count));
      return { ...statistics[key], description: key, color: colors[index] };
    });

    finalArray.sort((a, b) => b.value - a.value);

    /* const fileUrl = instaData[0].media_url;
    const gData = await downloadAndDetect(fileUrl, 0); */

    res.json({
      code: 200,
      statistics: finalArray,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/detail', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_ID', 'INS_TOKEN', 'INS_ACCOUNT_ID'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_TOKEN, INS_ACCOUNT_ID } = InstaData;

    const instaData = await getInstagramMediaData(INS_ACCOUNT_ID, INS_TOKEN);
    const statistics = instaData.reduce((acc, el) => {
      const { like_count, comments_count } = el;
      if (acc.likeStats) {
        acc.likeStats.push(like_count);
      } else {
        acc.likeStats = [like_count];
      }
      if (acc.commentsStats) {
        acc.commentsStats.push(comments_count);
      } else {
        acc.commentsStats = [comments_count];
      }
      return acc;
    }, {});

    res.json({
      code: 200,
      data: statistics,
    });
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsAge', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STAT_AGE_GENDER'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_STAT_AGE_GENDER } = InstaData;

    if (INS_STAT_AGE_GENDER) {
      const ageStats = JSON.parse(INS_STAT_AGE_GENDER);
      const ageStatsFiltered = Object.keys(ageStats).reduce((acc, item) => {
        if (acc[item.substring(2)]) {
          acc[item.substring(2)] += ageStats[item];
        } else {
          acc[item.substring(2)] = ageStats[item];
        }
        return acc;
      }, {});
      const maxAge = Object.keys(ageStatsFiltered).reduce((a, b) => (ageStatsFiltered[a] > ageStatsFiltered[b] ? a : b));
      const ordered = {};
      Object.keys(ageStatsFiltered).sort().forEach((key) => {
        ordered[key] = ageStatsFiltered[key];
      });
      const orderedFilter = Object.keys(ordered).reduce((acc, key) => {
        acc.interval.push(key);
        acc.age.push(ordered[key]);
        return acc;
      }, { interval: [], age: [] });


      res.json({
        code: 200,
        data: orderedFilter,
        maxAge
      });
    } else {
      res.json({
        code: 200,
        data: [],
      });
    }
    /* const statistics = instaData.reduce((acc, el) => {
      const { like_count, comments_count } = el;
      if (acc.likeStats) {
        acc.likeStats.push(like_count);
      } else {
        acc.likeStats = [like_count];
      }
      if (acc.commentsStats) {
        acc.commentsStats.push(comments_count);
      } else {
        acc.commentsStats = [comments_count];
      }
      return acc;
    }, {}); */
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsGender', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STAT_AGE_GENDER'],
    };

    const InstaData = await Instagram.findOne(options);
    const { INS_STAT_AGE_GENDER } = InstaData;

    if (INS_STAT_AGE_GENDER) {
      const ageStats = JSON.parse(INS_STAT_AGE_GENDER);
      const ageStatsFiltered = Object.keys(ageStats).reduce((acc, item) => {
        if (acc[item.charAt(0)]) {
          acc[item.charAt(0)] += ageStats[item];
        } else {
          acc[item.charAt(0)] = ageStats[item];
        }
        acc.sum = (acc.sum || 0) + ageStats[item];
        return acc;
      }, {});

      const {
        U, M, F, sum
      } = ageStatsFiltered;

      const male = Math.round(100 / (sum / M));
      const maxGender = M > F ? '남성' : '여성';

      res.json({
        code: 200,
        data: male,
        maxGender
      });
    } else {
      res.json({
        code: 200,
        data: 0,
      });
    }
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/statsMap', async (req, res) => {
  try {
    const { INS_ID } = req.query;

    const options = {
      where: { INS_ID },
      attributes: ['INS_STATE_LOC'],
    };

    const colors = [
      '#FF835D', '#409CFF', '#52D726', '#FF0000',
      '#FFEC00', '#7CDDDD', '#4D4D4D', '#5DA5DA',
      '#FAA43A', '#60BD68', '#F17CB0', '#B2912F',
      '#B276B2', '#DECF3F', '#81726A', '#270722',
      '#E8C547', '#C2C6A7', '#ECCE8E', '#DC136C',
      '#353A47', '#84B082', '#5C80BC', '#CDD1C4',
      '#7CDDDD'
    ];

    const InstaData = await Instagram.findOne(options);
    const { INS_STATE_LOC } = InstaData;

    if (INS_STATE_LOC) {
      const ageStats = JSON.parse(INS_STATE_LOC);

      const maxKey = Object.keys(ageStats).reduce((a, b) => (ageStats[a] > ageStats[b] ? a : b));
      const maxLoc = isoCountries[maxKey];

      const ageStatsArray = Object.keys(ageStats).map((key, index) => ({ country: key, count: ageStats[key] }));
      const sortedStats = ageStatsArray.sort((a, b) => b.count - a.count);
      const results = sortedStats.reduce((acc, item, index) => {
        acc.country.push(item.country);
        acc.count.push(item.count);
        acc.color.push(colors[index]);
        return acc;
      }, { country: [], count: [], color: [] });

      const results2 = sortedStats.map(item => ({
        id: item.country, name: isoCountries[item.country], value: item.count, color: '#ff5252'
      }));

      res.json({
        code: 200,
        data: results,
        data2: results2,
        maxLoc
      });
    } else {
      res.json({
        code: 200,
        data: [],
        data2: [],
      });
    }
  } catch (err) {
    res.json({
      code: 400,
      data: err.message,
    });
  }
});

router.get('/rankingInfo', async (req, res) => {
  try {
    const data = req.query;
    const { token, instaId } = data;
    const id = instaId || getIdFromToken(token).sub;

    const options = {
      where: { INF_ID: id },
      attributes: [
        'INS_ID',
        'INS_TOKEN',
        'INS_ACCOUNT_ID',
        'INS_NAME',
        'INS_USERNAME',
        'INS_MEDIA_CNT',
        'INS_FLW',
        'INS_FLWR',
        'INS_PROFILE_IMG',
        'INS_LIKES',
        'INS_CMNT',
        'INS_STATUS',
        'INS_TYPES',
        'INS_IS_FAKE',
        'INS_DT',
      ]
    };

    const InstaData = await Instagram.findOne(options);

    if (!InstaData) return res.status(201).send({ message: 'Instagram not connected' });

    const {
      INS_TOKEN, INS_ACCOUNT_ID, INS_FLWR, INS_CMNT, INS_STATUS
    } = InstaData;

    const resData = { ...InstaData.dataValues };

    if (INS_STATUS) {
      const detailInstaData = await getInstagramData(INS_ACCOUNT_ID, INS_TOKEN);
      const { biography, website } = detailInstaData;
      resData.biography = biography;
      resData.website = website;
    }

    // const resData = { ...InstaData.dataValues, biography, website };

    if (INS_FLWR && INS_CMNT) {
      const percentRatio = (INS_CMNT / INS_FLWR) * 100;
      if (percentRatio < 5) {
        resData.ability = '저조';
      } else if (percentRatio >= 5 && percentRatio < 10) {
        resData.ability = '보통';
      } else if (percentRatio >= 10 && percentRatio < 15) {
        resData.ability = '우수';
      } else {
        resData.ability = '훌륭';
      }

      if (INS_FLWR < 1000) {
        resData.influencerType = 'Nano Influencer';
      } else if (INS_FLWR >= 1000 && INS_FLWR < 20000) {
        resData.influencerType = 'Micro Influencer';
      } else if (INS_FLWR >= 1000 && INS_FLWR < 20000) {
        resData.influencerType = 'Professional';
      } else if (INS_FLWR >= 1000 && INS_FLWR < 20000) {
        resData.influencerType = 'Macro Influencer';
      } else {
        resData.influencerType = 'Celebrity';
      }
    }

    return res.status(200).json({ data: resData });
  } catch (err) {
    return res.status(400).send({ data: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const {
      facebookToken, facebookUserId, token, instaId
    } = data;
    const id = getIdFromToken(token).sub;
    const longToken = await getFacebookLongToken(facebookToken);

    if (instaId) {
      const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instaId } });
      if (instaAccountExist) {
        res.status(409).send({ message: '중복된 인스타그램 계정입니다' });
      } else {
        const instagramData = await getInstagramData(instaId, longToken);
        const mediaData = await getInstagramMediaData(instaId, longToken);
        const statistics = mediaData.reduce((acc, el) => ({
          likeSum: (acc.likeSum || 0) + el.like_count,
          commentsSum: (acc.commentsSum || 0) + el.comments_count,
        }), {});

        let ageStats;
        let genderLocalStats;

        try {
          const insights = await getInstagramInsights(instaId, longToken);
          ageStats = insights[0].values[0].value;
          genderLocalStats = insights[1].values[0].value;
        } catch (err) {
          console.log(err);
        }

        const {
          follows_count, followers_count, media_count, username, name, profile_picture_url
        } = instagramData;

        const createParams = {
          INF_ID: id,
          INS_FB_ID: facebookUserId,
          INS_TOKEN: longToken,
          INS_ACCOUNT_ID: instaId,
          INS_FLW: follows_count,
          INS_FLWR: followers_count,
          INS_NAME: name ? name.normalize('NFC') : null,
          INS_USERNAME: username,
          INS_MEDIA_CNT: media_count,
          INS_PROFILE_IMG: profile_picture_url,
          INS_LIKES: statistics.likeSum,
          INS_CMNT: statistics.commentsSum
        };

        if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
        if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

        await Instagram.create(createParams);
        res.status(200).json({ message: 'success' });
      }
    } else {
      const instaAccounts = await getInstagramBusinessAccounts(longToken);
      if (instaAccounts.length > 1) {
        res.status(202).json({ data: instaAccounts });
      } else {
        const instagramId = instaAccounts[0].id;
        const instaAccountExist = await Instagram.findOne({ where: { INS_ACCOUNT_ID: instagramId } });
        if (instaAccountExist) {
          res.status(409).json({ message: '중복된 인스타그램 계정입니다' });
        } else {
          const instagramData = await getInstagramData(instagramId, longToken);
          const {
            follows_count, followers_count, media_count, username, name, profile_picture_url
          } = instagramData;

          const mediaData = await getInstagramMediaData(instagramId, longToken);
          const statistics = mediaData.reduce((acc, el) => ({
            likeSum: (acc.likeSum || 0) + el.like_count,
            commentsSum: (acc.commentsSum || 0) + el.comments_count,
          }), {});

          let ageStats;
          let genderLocalStats;

          try {
            const insights = await getInstagramInsights(instagramId, longToken);
            ageStats = insights[0].values[0].value;
            genderLocalStats = insights[1].values[0].value;
          } catch (err) {
            console.log(err);
          }

          const createParams = {
            INF_ID: id,
            INS_TOKEN: longToken,
            INS_ACCOUNT_ID: instagramId,
            INS_FLW: follows_count,
            INS_FLWR: followers_count,
            INS_NAME: name,
            INS_USERNAME: username,
            INS_MEDIA_CNT: media_count,
            INS_PROFILE_IMG: profile_picture_url,
            INS_LIKES: statistics.likeSum,
            INS_CMNT: statistics.commentsSum
          };

          if (ageStats) createParams.INS_STAT_AGE_GENDER = JSON.stringify(ageStats);
          if (genderLocalStats) createParams.INS_STATE_LOC = JSON.stringify(genderLocalStats);

          await Instagram.create(createParams);
          res.status(200).json({ message: 'success', data: instagramData });
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/reconnect', async (req, res) => {
  try {
    const data = req.body;
    const {
      facebookToken, token
    } = data;
    const id = getIdFromToken(token).sub;
    const longToken = await getFacebookLongToken(facebookToken);

    const instaAccountData = await Instagram.findOne({ where: { INF_ID: id } });

    const { INS_ACCOUNT_ID } = instaAccountData;
    const mediaData = await getInstagramMediaData(INS_ACCOUNT_ID, longToken);

    if (!mediaData) {
      return res.status(201).json({ message: '계정 해제해서 다시 연결해주세요' });
    }
    await Instagram.update({ INS_TOKEN: longToken, INS_STATUS: 1 }, { where: { INF_ID: id } });
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res.status(400).json({ message: '계정 해제해서 다시 연결해주세요' });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const data = req.body;
    const { id } = data;

    await Instagram.destroy({ where: { INS_ID: id } });

    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
