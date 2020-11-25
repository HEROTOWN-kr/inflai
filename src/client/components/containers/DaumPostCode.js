import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import ReactFormText from './ReactFormText';
import StyledButton from './StyledButton';

function DaumPostCode(props) {
  const { setValue, register, errors } = props;
  const { daum } = window;
  const [guideText, setGuideText] = useState('');

  function execDaumPostcode() {
    new daum.Postcode({
      oncomplete(data) {
        const {
          roadAddress, bname, buildingName, zonecode, jibunAddress, autoRoadAddress, autoJibunAddress, apartment
        } = data;
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
        const roadAddr = roadAddress; // 도로명 주소 변수
        let extraRoadAddr = ''; // 참고 항목 변수

        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (bname !== '' && /[동|로|가]$/g.test(bname)) {
          extraRoadAddr += bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (buildingName !== '' && apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? `, ${buildingName}` : buildingName);
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraRoadAddr !== '') {
          extraRoadAddr = ` (${extraRoadAddr})`;
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        setValue('postcode', zonecode);
        setValue('roadAddress', roadAddr);
        console.log(roadAddr);
        // setValue('jibunAddress', jibunAddress);

        // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
        if (roadAddr !== '') {
          setValue('extraAddress', extraRoadAddr);
        } else {
          setValue('extraAddress', '');
        }
        // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
        if (autoRoadAddress) {
          const expRoadAddr = autoRoadAddress + extraRoadAddr;
          setGuideText(`(예상 도로명 주소 : ${expRoadAddr})`);
        } else if (autoJibunAddress) {
          const expJibunAddr = autoJibunAddress;
          setGuideText(`(예상 지번 주소 : ${expJibunAddr})`);
        } else {
          setGuideText('');
        }
      }
    }).open();
  }

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item onClick={execDaumPostcode} style={{ width: '190px' }}>
              <ReactFormText register={register} errors={errors} name="postcode" placeholder="우편번호" inputProps={{ readOnly: true }} />
            </Grid>
            <Grid item style={{ width: '190px' }}>
              <StyledButton onClick={execDaumPostcode} height="40px">우편번호 찾기</StyledButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ReactFormText register={register} errors={errors} name="roadAddress" onChange={event => setValue('roadAddress', event.target.value)} placeholder="도로명주소" inputProps={{ readOnly: true }} />
            </Grid>
            {/* <Grid item xs={5}>
              <ReactFormText register={register} errors={errors} name="jibunAddress" placeholder="지번주소" />
            </Grid> */}
          </Grid>
        </Grid>
        {/* {
          guideText ? (
            <Grid item xs={12}>
              {guideText}
            </Grid>
          ) : null
        } */}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <ReactFormText register={register} errors={errors} name="detailAddress" placeholder="상세주소" />
            </Grid>
            <Grid item xs={4}>
              <ReactFormText register={register} errors={errors} name="extraAddress" placeholder="참고항목" inputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default DaumPostCode;
