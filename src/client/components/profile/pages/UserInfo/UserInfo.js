import React, { useContext, useEffect, useState } from 'react';
import WhiteBlock from '../../../containers/WhiteBlock';
import PageTitle from '../PageTitle';
import StyledText from '../../../containers/StyledText';
import InfluencerInfo from './InfluencerInfo';
import AuthContext from '../../../../context/AuthContext';
import AdvertiserInfo from './AdvertiserInfo';


function UserInfo(props) {
  const { userRole } = useContext(AuthContext);

  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
              회원정보수정
          </StyledText>
        </PageTitle>
        {userRole === '1' ? (
          <AdvertiserInfo {...props} />
        ) : (
          <InfluencerInfo {...props} />
        )}

      </WhiteBlock>
    </div>
  );
}

export default UserInfo;
