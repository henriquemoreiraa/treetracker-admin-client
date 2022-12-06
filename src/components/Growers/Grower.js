import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Typography,
  Card,
  CardActions,
  CardContent,
} from '@material-ui/core';
import { Person } from '@material-ui/icons';
import LinkToWebmap from '../common/LinkToWebmap';
import OptimizedImage from '../OptimizedImage';
import GrowerOrganization from 'components/GrowerOrganization';
import { useStyle, GROWER_IMAGE_SIZE } from './Growers.styles.js';

export const Grower = ({ grower, growerClick }) => {
  const classes = useStyle();

  return (
    <Box onClick={() => growerClick(grower)}>
      <Card
        id={`card_${grower.id}`}
        className={clsx(
          classes.card,
          grower.placeholder && classes.placeholderCard
        )}
        classes={{
          root: classes.growerCard,
        }}
      >
        <CardContent className={classes.cardContent}>
          {grower.imageUrl ? (
            <OptimizedImage
              src={grower.imageUrl}
              width={GROWER_IMAGE_SIZE}
              height={GROWER_IMAGE_SIZE}
              className={classes.cardMedia}
              fixed
              rotation={grower.imageRotation}
              alertTextSize=".7rem"
              alertTitleSize="1rem"
            />
          ) : (
            <Box className={classes.cardMedia}>
              <Person className={classes.person} />
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Box>
            <Typography className={classes.name}>
              {grower.firstName} {grower.lastName}
            </Typography>
            <Typography>
              ID:{' '}
              <LinkToWebmap
                value={grower.reference_id ? grower.reference_id : grower.id}
                type="planters"
              />
            </Typography>
            <GrowerOrganization
              organizationName={grower?.organization}
              assignedOrganizationId={grower?.organizationId}
              compact={true}
            />
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Grower;
