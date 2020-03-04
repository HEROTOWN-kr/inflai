import React from 'react';
import Grid from '@material-ui/core/Grid';
import { spacing } from '@material-ui/system';
import '../../css/sub.scss';
import TitleImage from '../../img/home-title.png';
import AboutImage from '../../img/home-about.png';
import {Button} from "@material-ui/core";

const $colorBg = '#fefefe', $colorBlue = '#093c5e', $aqua = '#23c9cf', $white = '#ffffff'

const FontSettings = {
  first: {
    fontSize: '30px',
    color: $aqua
  },
  second: {
    position: 'absolute',
    right: '10px',
    top: '50px',
    fontWeight: 'bold',
    fontSize: '72px',
    color: $aqua
  },
  third: {
    fontSize: '18px',
    color: $white,
    fontWeight: 'bold',
    lineHeight: '180%',
    paddingTop: '100px'
  },
  fourth: {
    width: '178px',
    height: '50px',
    border: '2px solid #23c9cf',
    fontSize: '20px',
    color: $white,
    borderRadius: '25px'
  },
  fifth: {
    fontWeight: 'bold',
    fontSize: '58px',
    color: $colorBlue
  },
  sixth: {
    fontSize: '36px',
    color: '#454545'
  },
  seventh: {
    fontSize: '15px',
    color: '#454545'
  },
  eights: {
    fontSize: '55px',
    color: $aqua,
    margin: '40px 0'
  },
  ninth: {
    fontSize: '19px',
    color: $white,
    textAlign: 'center',
    marginBottom: '123px'
  },
  tenth: {
    width: 'inherit',
    color: $white,
    fontSize: '30px',
    fontWeight: 'bold'
  },
  eleventh: {
    color: $white
  },
  triangle: {
    zIndex: '0',
    position: 'absolute',
    top: 0,
    right: '510px',
    width: 0,
    height: 0,
    borderBottom: '1039px solid #fefefe',
    borderLeft: '577px solid transparent'
  },
  aqua: {
    color: $aqua
  },
  white: {
    color: $white
}

};


function Home() {
  return (
    <div className="home">
      <Grid container className="greeting">
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

      <div style={FontSettings.triangle}></div>
      <div className="wraper one">
        <Grid className="about" container alignItems="center">
          <Grid container xs={8} className="image">
            <img src={AboutImage} />
          </Grid>
          <Grid container xs={4} className="text">
            <Grid container alignContent="baseline" style={FontSettings.fifth}>INFL<span style={FontSettings.aqua}>Ai</span>?</Grid>
            <Grid container style={FontSettings.sixth}>아직도 팔로워나<br />
              좋아요 숫자에 연연하시나요?<br />
              구매전환율이 높은<br />
              인플루언서를 매칭해드립니다.</Grid>
            <Grid container style={FontSettings.seventh} alignContent="flex-end">AI 분석결과 추천된 인플루언서들은 다음과 같은 이유로<br />
              INFLAI 의 우수성을 증명해줍니다.
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="profit">
        <div className="wraper two">
          <Grid container style={{height: "inherit"}} alignItems="center">
            <Grid container justify="center" className="content">
              <Grid container xs={3} justify="space-between">
                <Button variant="outlined" className="func-button">광고주</Button>
                <Button variant="outlined" className="func-button">인플루언서</Button>
              </Grid>
              <div style={FontSettings.eights}>데이터 기반 정보마케팅<span style={FontSettings.white}>을 통한 ROI 상승</span></div>
              <div style={FontSettings.ninth}>
                우리의 알고리즘은 당신의 제품을 가장 우수하고 가장 관련성이 높은 인플루언서와 매칭시켜,<br />
                결과적으로 최종 소비자에게 좋은 영향을 주게됩니다.<br />
                인플루언서들에게 우리는 그들의 팔로워들이 좋아할 서비스나 제품을 제공합니다.
              </div>
              <Grid container className="detail">
                <Grid container xs={3} style={{textAlign: "right"}}>
                  <Grid container>
                    <Grid container alignItems="flex-end" justify="flex-end" style={FontSettings.tenth}>
                      효율성
                    </Grid>
                    <div style={FontSettings.eleventh}>
                      한번에 광고하려는 브랜드에 맞게
                      인플루언서를 찾아 추천하고 관리합니다.
                    </div>
                  </Grid>
                  <Grid container>
                    <Grid container alignItems="flex-end" justify="flex-end" style={FontSettings.tenth}>직접 소통</Grid>
                    <div style={FontSettings.eleventh}>
                      대행사를 통하지 않고 직접 소통하여
                      빠른처리 및 정확한 지침을 알려줍니다.
                    </div>
                  </Grid>
                  <Grid container>
                    <Grid container alignItems="flex-end" justify="flex-end" style={FontSettings.tenth}>저렴한 매칭비용</Grid>
                    <div style={FontSettings.eleventh}>
                      우리는 저렴한 매칭비용으로 보다
                      효과적인 광고효율을 제공합니다.
                    </div>
                  </Grid>
                </Grid>
                <Grid container xs={6} className="laptop" justify="center">
                  <Grid container xs={10} className="laptop-image"></Grid>
                </Grid>
                <Grid container xs={3}>
                  <Grid container>
                    <Grid container alignItems="flex-end" style={FontSettings.tenth}>편한 관리</Grid>
                    <div style={FontSettings.eleventh}>
                      쉬운 광고관리자 모드를 통해
                      여러분의 캠페인을 관리하세요.
                    </div>
                  </Grid>
                  <Grid container>
                    <Grid container alignItems="flex-end" style={FontSettings.tenth}>이벤트</Grid>
                    <div style={FontSettings.eleventh}>
                      광고주를 위한 풍부한 이벤트를 놓치지 마세요.
                      교육부터 마일리지 프로모션까지!
                    </div>
                  </Grid>
                  <Grid container>
                    <Grid container alignItems="flex-end" style={FontSettings.tenth}>광고주맞춤형 서비스</Grid>
                    <div style={FontSettings.eleventh}>
                      맞춤형패키지로 광고비를 절약하세요.
                      가장 효율적인 마케팅서비스.
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container alignContent="flex-end" justify="center">
                <Button variant="outlined" className="func-button">Read More</Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Home;
