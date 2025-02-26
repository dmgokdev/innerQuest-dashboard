import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  // active menu item on page load
  useEffect(() => {
    if (pathname === item.url) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
  }, [pathname, item.url, dispatch]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        background:
          customization.isOpen.findIndex((id) => id === item.id) > -1
            ? 'linear-gradient(90deg, #36e4a1 0%, #18bde8 100%)'
            : level > 1
              ? 'transparent'
              : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
        color: customization.isOpen.findIndex((id) => id === item.id) > -1 ? '#fff' : 'inherit',
        '&:hover': {
          background: 'linear-gradient(90deg, #36e4a1 0%, #18bde8 100%)',
          color: '#fff',
          '& .MuiListItemIcon-root': {
            color: '#fff' // Ensure icon color turns white on hover
          }
        }
      }}
      selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon
        sx={{
          my: 'auto',
          minWidth: !item?.icon ? 18 : 36,
          color: customization.isOpen.findIndex((id) => id === item.id) > -1 ? '#fff !important' : 'inherit',
          '&:hover': {
            color: '#fff !important'
          }
        }}
      >
        {itemIcon}
      </ListItemIcon>

      <ListItemText
        primary={
          <Typography
            variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
            sx={{
              color: customization.isOpen.findIndex((id) => id === item.id) > -1 ? '#fff' : 'inherit'
            }}
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{
                ...theme.typography.subMenuCaption,
                display: 'block',
                gutterBottom: true,
                color: customization.isOpen.findIndex((id) => id === item.id) > -1 ? '#fff' : 'inherit'
              }}
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
