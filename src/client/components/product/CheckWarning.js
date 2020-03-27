import React from 'react';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/AssignmentTurnedInRounded';
import { Divider } from '@material-ui/core';

function CheckWarning() {
  return (
    <React.Fragment>
      <Divider />
      <div className="warning-message wraper vertical2">
        <Grid container alignItems="center">
          <Grid item md={3}>
            <Grid container className="icon-field">
              <Grid item md={12}>
                <WarningIcon />
                <div className="icon-text">확인해주세요!</div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={9}>
            <Grid container className="text-list">
              <Grid item md={11}>
                <ul>
                  <li>캠페인 생성을 위해 반드시 캠페인 요청서를 작성해주세요. 요청서 미작성 시, 해당 캠페인은 7일 후 자동으로 삭제됩니다.</li>
                  <li>
                                    캠페인 생성 이후 모집시작일로부터 14일을 경과한 미진행 캠페인은 자동으로 삭제됩니다.
                    <br />
                                    - 선발기간에 미선발 상태로 다음 단계를 진행하지 않는 경우
                  </li>
                  <li>
                                    위와 같은 미진행 캠페인이 1주일 이내 3개 이상일 경우, 브릭머니가 모두 환불되고, 이후 1개월 동안 캠페인을 생성할 수 없습니다.
                  </li>
                  <li>
                                    1차 모집 후 모집인원 미달 시 현재 인원만으로 캠페인을 진행하거나, 아래와 같이 진행할 수 있습니다.
                    <br />
                                    - 모집된 신청 인플루언서 중 등급과 상관 없이 부족한 인원 충원 (견적가는 변경될 수 있습니다)
                  </li>
                  <li>
                                    캠페인 진행 중 인플루언서의 노쇼가 발생되는 경우 다음과 같이 처리됩니다.
                    <br />
                                    - 노쇼 인플루언서의 개별 단가만큼 브릭머니로 환급 (브릭머니 환급은 브릭씨로 문의 부탁드립니다)
                    <br />
                                    - 협찬품 제공 후 인플루언서가 노쇼를 하는 경우 해당 제품에 대한 비용은 보장할 수 없습니다.
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default CheckWarning;
