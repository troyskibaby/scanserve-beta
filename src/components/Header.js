// Header.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from './AuthContext';
import { FaUser, FaBell, FaSignOutAlt, FaCogs, FaIdBadge, FaCreditCard, FaHome } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Adjust path if needed


const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // for optional active highlighting

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const subscriptionName = user?.PlanID === 5 ? 'Premium' : 'Basic';

  return (
    <>
<AppBar position="static" elevation={0} sx={{ backgroundColor: '#1A2238', color: '#ffffff' }}>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    {/* Logo on the Left */}
    <Box
      sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      <img
        src={logo}
        alt="ScanServe Logo"
        style={{ height: '60px', marginRight: '12px' }}
      />
    </Box>

    {/* Menu on the Right */}
    <IconButton
  edge="end"
  color="inherit"
  onClick={toggleDrawer(true)}
  sx={{ padding: '12px' }}
>
  <MenuIcon sx={{ fontSize: 32 }} />  {/* 👈 default is 24 */}
</IconButton>

  </Toolbar>
</AppBar>





      {/* Drawer Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box
  sx={{
    width: 280,
    backgroundColor: '#ffffff',
    height: '100%',
    color: '#1A2238',
  }}

  role="presentation"
  onClick={toggleDrawer(false)}
>

          {user ? (
            <List>

              {/* My Dashboard */}
              <ListItem
                button
                selected={location.pathname === '/dashboard'}
                onClick={() => navigate('/dashboard')}
              >
                <ListItemIcon>
                  <FaHome color="#1A2238" />
                </ListItemIcon>
                <ListItemText primary="My Dashboard" />
              </ListItem>

              {/* Notifications (disabled) */}
              <ListItem disabled>
                <ListItemIcon>
                  <FaBell />
                </ListItemIcon>
                <ListItemText
                  primary="My Notifications"
                  secondary="Coming Soon"
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItem>

              <Divider sx={{ my: 2 }} />

              {/* Account Section Header */}
              <ListItem>
                <ListItemIcon>
                  <FaUser />
                </ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItem>

              {/* My Details (disabled) */}
              <ListItem disabled sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FaIdBadge />
                </ListItemIcon>
                <ListItemText primary="My Details" secondary="Coming Soon" />
              </ListItem>

              {/* Subscription (disabled with sub text) */}
              <ListItem disabled sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FaCreditCard />
                </ListItemIcon>
                <ListItemText primary="My Subscription" secondary={subscriptionName} />
              </ListItem>

              {/* Logout */}
              <ListItem
  button
  sx={{ pl: 4 }}
  onClick={(e) => {
    e.stopPropagation(); // prevent drawer auto-close
    logout();            // clear auth token/context
    navigate('/login');  // redirect user
  }}
>
  <ListItemIcon><FaSignOutAlt /></ListItemIcon>
  <ListItemText primary="Logout" />
</ListItem>

            </List>
          ) : (
            <List>
              <ListItem button onClick={() => navigate('/login')}>
                <ListItemIcon>
                  <FaUser />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>

              <ListItem button onClick={() => navigate('/signup')}>
                <ListItemIcon>
                  <FaCogs />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
