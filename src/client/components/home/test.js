import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../css/sub.scss';


function Test({
    FontSettings
              }) {
  return (
    <div>
        <Grid container>
            <Grid xs={5} style={{background: '#093c5e'}}>
                <div>

                </div>
            </Grid>
            <Grid xs={3} style={{background: 'yellow'}}>
                <div style={{
                    width: 0,
                    height: 0,
                    borderBottom: '1039px solid #fefefe',
                    borderLeft: '577px solid transparent'}}></div>
            </Grid>
            <Grid xs={4} style={{background: 'red'}}>asdf</Grid>
        </Grid>
    </div>
  );
}

export default Test;
