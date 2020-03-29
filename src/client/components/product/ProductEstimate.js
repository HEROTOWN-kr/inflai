import React from 'react';
import { Grid, Divider, Button } from '@material-ui/core';
import CheckWarning from './CheckWarning';


function ProductEstimate(props) {
  function MyItem({
    mykey,
    value,
    color
  }) {
    return (
      <Grid item md={12} className={`price-description ${color === 'red' ? 'red' : null}`}>
        <Grid container justify="space-between">
          <Grid item md={4}>{mykey}</Grid>
          <Grid item md={3} className="value">{value}</Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <div className="estimate">
      <div className="title">
        <div className="main">캠페인 예상 견적</div>
      </div>
      <div className="tip">
        <div className="tip-main">
            현재 페이지는 예상 견적 확인용 페이지 입니다.
        </div>
        <div className="tip-secondary">
            자세한 사항은 캠페인 상세 요청서를 작성 후 정확하게 받아보실 수 있으며
          <br />
            세부적인 내용에 따라 위 견적은 변동될 수 있습니다.
        </div>
      </div>
      <Grid container justify="center" className="wraper vertical3">
        <Grid item md={6}>
          <Grid container spacing={3}>
            <MyItem mykey="모집방법" value="인플루언서 믹스" />
            <MyItem mykey="모집인원" value="1명" />
            <MyItem mykey="예상 총 도달 수(KPI)" value="678" />
            <MyItem mykey="서비스 이용료" value="3,000원" />
            <Grid item md={12}>
              <Divider />
            </Grid>
            <MyItem mykey="결제금액" value="18,000원" color="red" />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item md={3} className="submit-button">
            <Button type="submit" onClick={() => props.history.push(`${props.match.path}/write`)}>캠페인 요청서 작성</Button>
          </Grid>
        </Grid>
      </Grid>
      <CheckWarning />
    </div>
  );
}

export default ProductEstimate;
