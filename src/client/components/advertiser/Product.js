import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  Radio, FormControlLabel, RadioGroup, FormControl, Divider, Input, OutlinedInput, FormHelperText, InputAdornment, TextField
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

function Product() {
  const [radioValue, setRadioValue] = useState('');

  const counter = [
    {
      level: '나노',
      count: '1,000~10,000',
      aim: '포스팅을 많이 생성하여 해시태그 점유율을 높이고 싶을 때! 다수 진행 추천!'
    },
    {
      level: '마이크로',
      count: '10,000~30,000',
      aim: '영향력이 점점 커저가는 인플루언서! 소수팬으로 프로모션 효과 상승에 효과적!'
    },
    {
      level: '메크로',
      count: '30,000~50,000',
      aim: '영향력, 전달력 상승기의 인플루언서! 전환율 상승, 프로모션 효과 상승에 최적!'
    },
    {
      level: '메가',
      count: '50,000~100,000',
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승을 위한 높은 전달력이 필요할 때 추천!'
    },
    {
      level: '셀럽',
      count: '100,000+',
      aim: '신제품 컨셉 등 브랜드, 상품 인지도 상승 필수 보장!'
    }
  ];


  const StyledRadio = ({ value }) => (
    <div className="card">
      <Grid container justify="center" spacing={1}>
        <Grid item md={12}>
          <div className="icon">
            <img src="" alt="" />
          </div>
        </Grid>
        <Grid item md={12}>
          <div className="main-title">상품 리뷰</div>
        </Grid>
        <Grid item md={12}>
          <div className="secondary-title">무료 협찬 제품 배송형</div>
        </Grid>
        <Grid item md={12}>
          <div className="third-title">
                      크리에이터에게 무료 협찬 제붐을
            <br />
                      배송 제공하여 사용 후기 컨텐츠 제작
          </div>
        </Grid>
        <Grid item md={12}>
          <Radio value={value} />
        </Grid>
      </Grid>
    </div>
  );

  const Counter = ({ data }) => {
    const counterText = () => (
      <span className="counter-textHolder">
        <Grid container>
          <Grid item md={2}><span className="level">{data.level}</span></Grid>
          <Grid item md={3}><span className="count">{data.count}</span></Grid>
          <Grid item md={7}><span className="aim">{data.aim}</span></Grid>
        </Grid>
      </span>
    );

    return (
      <TextField
        id="outlined-start-adornment"
        className="counter"
        InputProps={{
          startAdornment: <InputAdornment position="start">{counterText()}</InputAdornment>,
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }}
        placeholder="0"
        variant="outlined"
      />
    );
  };


  return (
    <div className="product wraper vertical2">
      <Grid container justify="center">
        <Grid item lg={7}>
          <div className="title wraper vertical3">
            <div className="main">캠페인 예상 견적 요청하기</div>
            <div className="secondary">인플루언서 믹스</div>
          </div>
          <div className="tip">
            <div className="tip-main">
              <span>인플루언서 믹스</span>
                    를 선택하셨네요!
            </div>
            <div className="tip-secondary">
                마케팅의 목적에 맞추어 인플루언서의 등급과 수를 Mix하여 진행해보세요.
              <br />
                타겟팅 된 인플루언서를 모집한 후에 원하는 분을 직접 선택할 수 있어서 만족도가 높아요!
            </div>
          </div>
          <div className="step-one wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">STEP 1</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <div className="step-title">캠페인 유형을 선택하세요</div>
                  </Grid>
                  <Grid item md={12}>
                    <FormControl>
                      <RadioGroup row aria-label="gender" name="gender1" value={radioValue} onChange={event => setRadioValue(event.target.value)}>
                        <Grid container spacing={3}>
                          {['1', '2', '3', '4', '5', '6'].map(item => (
                            <Grid item md={4}>
                              <FormControlLabel key={item} value="1" control={<StyledRadio value={item} />} />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className="step-two wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">STEP 2</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <div className="step-title">
                      <span>희망하는 인플루언서 등급별 인원 수를 설정하세요.</span>
                      <span className="grey">(등급 당 최대 10,000명까지 입력 가능합니다.)</span>
                    </div>
                  </Grid>
                  {counter.map(i => (
                    <Grid key={i.level} item md={12}>
                      <Counter data={i} />
                    </Grid>
                  ))}
                  <Grid item md={12}>
                    <div className="counter-result">
                      <span className="result-text">총 모집인원</span>
                      <span className="inf-number">130명</span>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className="step-three wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">STEP 3</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <div className="step-title">
                      <span>협찬품 가격을 입력하세요</span>
                    </div>
                  </Grid>

                  <Grid item md={12}>
                    <TextField
                      id="outlined-start-adornment"
                      className="counter"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">인플루언서 1인당 제공되는 협찬품의 시장가</InputAdornment>,
                        endAdornment: <InputAdornment position="end">명</InputAdornment>
                      }}
                      placeholder="0"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <div className="step-four wraper vertical2">
            <Grid container>
              <Grid item md={3}>
                <div className="step">STEP 4</div>
              </Grid>
              <Grid item md={9}>
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <div className="step-title">
                      <span>생성된 콘텐츠의 2차 활용 여부를 알려주세요</span>
                    </div>
                  </Grid>

                  <Grid item md={12} className="counter">
                    {/* <TextField
                      id="outlined-start-adornment"
                      className="counter"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">콘텐츠 2차 활용 예정</InputAdornment>,
                        endAdornment: <InputAdornment position="end">공식계정 리그램만 가능, 이외 마케팅은 불가</InputAdornment>
                      }}
                      placeholder="0"
                      variant="outlined"
                    /> */}

                    <label className="checkbox-label" htmlFor="r1">
                      <Grid container justify="space-between">
                        <Grid item md={3}>
                          <input type="checkbox" name="rGroup" value="1" id="r1" />
                          <CheckIcon />
                          <span>콘텐츠 2차 활용 예정</span>
                        </Grid>
                        <Grid item md={5} style={{ textAlign: 'right', paddingTop: '7px' }}>공식계정 리그램만 가능, 이외 마케팅은 불가</Grid>
                      </Grid>
                    </label>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Product;
