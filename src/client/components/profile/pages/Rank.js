import React, { useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import WhiteBlock from '../../containers/WhiteBlock';
import PageTitle from './PageTitle';
import StyledText from '../../containers/StyledText';
import InstagramInfo from './InstagramInfo';

function Rank(props) {
  const [selectedSns, setSelectedSns] = useState(1);

  const snsTypes = [
    {
      name: 'Instagram',
      id: 1
    },
    {
      name: 'Youtube',
      id: 2
    },
  ];

  function SnsButtonComponent(props) {
    const { snsName, id } = props;
    return (
      <Box
        py={2}
        px={3}
        className={`sns-button ${id === selectedSns ? 'selected' : null}`}
        onClick={() => setSelectedSns(id)}
      >
        <StyledText>{snsName}</StyledText>
      </Box>
    );
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WhiteBlock>
            <PageTitle>
              <StyledText fontSize="24">
                            랭킹 정보
              </StyledText>
            </PageTitle>
            <Box py={4} px={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {snsTypes.map(item => (
                      <Grid item key={item.id}>
                        <SnsButtonComponent snsName={item.name} id={item.id} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </WhiteBlock>
        </Grid>
        <Grid item xs={12}>
          <InstagramInfo {...props} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Rank;
