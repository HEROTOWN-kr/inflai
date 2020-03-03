import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../css/sub.scss';
import TitleImage from '../../img/home-title.png';

const FontSettings = {
  first: {
    fontSize: '30px',
    color: '#23c9cf'
  },
  second: {
    position: 'absolute',
    right: '10px',
    top: '50px',
    fontWeight: 'bold',
    fontSize: '72px',
    color: '#23c9cf'
  },
  third: {
    fontSize: '18px',
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: '180%',
    paddingTop: '100px'
  },
  fourth: {
    width: '178px',
    height: '50px',
    border: '2px solid #23c9cf',
    fontSize: '20px',
    color: '#ffffff',
    borderRadius: '25px'
  }
};

function Home() {
  return (
    <Grid container className="home greeting">
      <Grid container justify="flex-end" className="angle" alignContent="flex-end">
        <Grid container className="title" alignItems="center">
          <Grid container className="title text">
            <Grid container alignContent="flex-start" style={FontSettings.first}>Show me your brand</Grid>
            <Grid container style={FontSettings.second}>인플루언서 마케팅</Grid>
            <Grid container style={FontSettings.third}>
                여러분의 상품과 서비스를 인플루언서를 통해 일려보세요.
              <br />
                         유튜버와 인스타그래머, 블로거들이 상세히 알려드릴
              <br />
                         준비를 하고 있습니다.
            </Grid>
            <Grid container alignContent="flex-end">
              <Grid container alignItems="center" justify="center" style={FontSettings.fourth}>
                    Get Started
              </Grid>
            </Grid>
          </Grid>
        </Grid>
          <img className="title-image" src={TitleImage} />
      </Grid>
    </Grid>
  );
}

export default Home;
