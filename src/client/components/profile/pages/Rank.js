import React from 'react';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';

function Rank() {
  return (
    <div>
      <WhiteBlock>
        <PageTitle>
          <StyledText fontSize="24">
                  랭킹 정보
          </StyledText>
        </PageTitle>
      </WhiteBlock>
    </div>
  );
}

export default Rank;
