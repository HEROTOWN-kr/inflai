import React, { useContext, useEffect, useState } from 'react';
import WhiteBlock from '../../../containers/WhiteBlock';
import StyledText from '../../../containers/StyledText';
import PageTitle from '../PageTitle';
import AuthContext from '../../../../context/AuthContext';
import AdvCampaignInfo from './AdvCampaignInfo';
import InfCampaignInfo from './InfCampaignInfo';


function CampaignInfo(props) {
  const { userRole } = useContext(AuthContext);
  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
            캠페인 관리
          </StyledText>
          {/* <button onClick={getCampaigns}>testApi</button> */}
        </PageTitle>
        {userRole === '1' ? (
          <AdvCampaignInfo {...props} />
        ) : (
          <InfCampaignInfo {...props} />
        )}
      </WhiteBlock>
    </div>
  );
}

export default CampaignInfo;
