import clsx from 'clsx';
import { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import PersonIcon from '@mui/icons-material/Person';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CommonTooltip from '@/components/common/toolTip';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton, useTheme, ListItemButton } from '@mui/material';
import { useAuth } from '@/contexts/authContext';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};
type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
};
type SubMenuItem = {
  name: string;
  path: string;
  disabled?: boolean;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionDetails } = useAuth();

  const desc = subscriptionDetails?.[0]?.description?.toLowerCase() || "";
  const hasCrypto = desc.includes("crypto");
  const hasCard = desc.includes("card");

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredItem, setHoveredItem] = useState<any>(null);

  // Only Crypto and Cards menu are restricted
  function isMenuDisabled(name: string) {
    if (name === "Crypto") return !hasCrypto;
    if (name === "Cards")  return !hasCard;
    return false;
  }

 const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Cards', icon: <CreditCardIcon />, hasDropdown: true,
      subItems: [
        { name: 'Your Cards', path: '/cards' },
        { name: 'Card Requests', path: '/card-requests' },
      ],
    },
    { name: 'Transaction', icon: <SyncAltIcon />, path: '/transactions' },
    { name: 'Crypto', icon: <CurrencyBitcoinIcon />, hasDropdown: true,
      subItems: [
        { name: 'Dashboard', path: '/crypto-dashboard' },
        { name: 'Wallet', path: '/wallets' },
        { name: 'Available Blockchains', path: '/blockchain' },
      ],
    },
    { name: 'Subscriptions', icon: <SubscriptionsIcon />, hasDropdown: true,
      subItems: [
        { name: 'All Plans', path: '/all-plans' },
        { name: 'My Plans', path: '/my-plans' },
      ],
    },
    { name: 'Account', icon: <AccountBalanceIcon />, path: '/wallet-accounts' },
    { name: 'User Profile', icon: <PersonIcon />, path: '/user-profile' },
    { name: 'Currency', icon: <MoneyOffIcon />, hasDropdown: true, subItems: [
        { name: 'Currency List', path: '/currency' },
        { name: 'Exchange Pair List', path: '/exchange-pairs' },
        { name: 'Instrument Pair List', path: '/instrument-pairs' },
      ],
    },
    { name: 'Token', icon: <SupportAgentIcon />, hasDropdown: true, subItems: [
        { name: 'Tokens List', path: '/tokens' },
        { name: 'Summary Tokens List', path: '/summary-tokens' },
      ],
    },
    { name: 'Refer & Earn', icon: <Diversity3Icon />, path: '/refer-earn' },
    { name: 'Invoices', icon: <RequestQuoteIcon />, hasDropdown: true, subItems: [
        { name: 'Original Invoices', path: '/original-invoices' },
        { name: 'Recurring Invoices', path: '/recurring-invoices' },
        // { name: 'Toast Demo', path: '/demo' },
      ],
    },
  ];

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    item: any
  ) => {
    if (!isOpen && item.subItems) {
      setAnchorEl(event.currentTarget);
      setHoveredItem(item);
    }
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setHoveredItem(null);
  };

  return (
    <Box
      className={`user-sidebar ${isOpen ? 'open' : 'closed'}`}

      sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, boxShadow: theme.shadows[2], width: isOpen ? 200 : 60, overflow: 'visible', position: 'relative', zIndex: 1201, }} >
      {/* Header */}
      <Box className={`user-sidebar-header ${isOpen ? 'open' : 'closed'}`} sx={{ p: 2 }}>
        {isOpen && (
          <Box className='header-comp'>
            <img className='logo-img' src="../logo.png" alt="Logo" />
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              QUICK CASH
            </Typography>
          </Box>
        )}
        <IconButton onClick={toggleSidebar} size="small">
          <MenuIcon />
        </IconButton>
      </Box>

      <List sx={{ p: 1 }}>
        {menuItems.map((item) => {
          const disabled = isMenuDisabled(item.name);

          // For Crypto/Cards, mark all subitems disabled as well if parent dies
          let subItems = item.subItems;
          if ((item.name === "Crypto" && !hasCrypto) || (item.name === "Cards" && !hasCard)) {
            subItems = subItems?.map(sub => ({ ...sub, disabled: true }));
          }

          return (
            <Box key={item.name} onMouseEnter={(e) => handleMouseEnter(e, item)} onMouseLeave={handleMouseLeave}>
              <CommonTooltip title={ disabled ? "You don't have a subscription to access this feature" : "" } arrow placement="right" disableHoverListener={!disabled} >
                <span>
                  <ListItem button disabled={disabled} className={clsx('menu-item', { 'active': location.pathname === item.path })} onClick={() => { if (!disabled && item.path) navigate(item.path); if (item.hasDropdown) { setOpenDropdown(openDropdown === item.name ? null : item.name); } }}>
                    <ListItemIcon className='menu-list-item'>
                      {item.icon}
                    </ListItemIcon>
                    {isOpen && (
                      <>
                        <ListItemText className="menu-items-text" primary={item.name} classes={{ primary: 'menu-items-text-root' }} />
                        {item.hasDropdown && (
                          <ExpandMoreIcon className={clsx('expand-more-icon', { expanded: openDropdown === item.name, })} />
                        )}
                      </>
                    )}
                  </ListItem>
                </span>
              </CommonTooltip>
              {/* Dropdown items, if any */}
             {isOpen && item.hasDropdown && subItems && openDropdown === item.name && (
                <List className="submenu">
                  {subItems.map(sub => (
                    <CommonTooltip key={sub.name} title={ sub.disabled ? "You don't have a subscription to access this feature" : "" } arrow placement="right" disableHoverListener={!sub.disabled} >
                      <span>
                        <ListItemButton disabled={sub.disabled} className={clsx('submenu-item', { 'active': location.pathname === sub.path })}
                          onClick={() => {
                            if (!sub.disabled && sub.path) navigate(sub.path);
                          }}
                        >
                          <ListItemText
                            primary={sub.name}
                            className="submenu-text"
                          />
                        </ListItemButton>
                      </span>
                    </CommonTooltip>
                  ))}
                </List>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;


// import clsx from 'clsx';
// import { useState } from 'react';
// import { Menu as MenuIcon,} from 'lucide-react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
// import SyncAltIcon from '@mui/icons-material/SyncAlt';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
// import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import PersonIcon from '@mui/icons-material/Person';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import SupportAgentIcon from '@mui/icons-material/SupportAgent';
// import Diversity3Icon from '@mui/icons-material/Diversity3';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
// import MoneyOffIcon from '@mui/icons-material/MoneyOff';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import {Box,List,ListItem,ListItemIcon,ListItemText,Typography,IconButton,useTheme,Popper,Paper,ListItemButton,
// } from '@mui/material';

// type SidebarProps = {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// };

// const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [hoveredItem, setHoveredItem] = useState<any>(null);

//   const menuItems = [
//     { name: 'Dashboard', icon: <DashboardIcon />,path: '/dashboard' },
//     { name: 'Cards', icon: <CreditCardIcon />, hasDropdown: true,
//       subItems: [
//         { name: 'Your Cards', path: '/cards' },
//         { name: 'Card Requests', path: '/card-requests' },
//       ]   },
//     { name: 'Transaction', icon: <SyncAltIcon />, path: '/transactions' },
//     // { name: 'Statement', icon: <ReceiptLongIcon />, path: '/statements' },
//     // { name: 'BlockChain', icon: <AccountTreeIcon />,
//     //    hasDropdown: true,
//     //   subItems: [
//     //     { name: 'Available Blockchains', path: '/blockchain' },
//     //     { name: 'Wallet', path: '/wallets' },
//     //   ]  },
//     {
//       name: 'Crypto',
//       icon: <CurrencyBitcoinIcon />,
//       hasDropdown: true,
//       subItems: [
//         { name: 'Dashboard', path: '/crypto-dashboard' },
//         { name: 'Wallet', path: '/wallets' },
//         { name: 'Available Blockchains', path: '/blockchain' },
//         // { name: 'Spot', path: '/spot' },
//         // { name: 'Buy / Sell / Swap', path: '/buysellswap' }
//       ]
//     },
//      {
//       name: 'Subscriptions',
//       icon: <SubscriptionsIcon />,
//       hasDropdown: true,
//       subItems: [
//         { name: 'All Plans', path: '/all-plans' },
//         { name: 'My Plans', path: '/my-plans' },
//       ]
//     },
//      {
//     name: 'Account',
//     icon: <AccountBalanceIcon />,
//     path: '/wallet-accounts',
//   },
  
//     { name: 'User Profile', icon: <PersonIcon />, path: '/user-profile' },
//      { name: 'Currency', icon: < MoneyOffIcon />,
//        hasDropdown: true,
//       subItems: [
//         { name: 'Currency List', path: '/currency' },
//         { name: 'Exchange Pair List', path: '/exchange-pairs' },
//         { name: 'Instrument Pair List', path: '/instrument-pairs' },
//       ]  },
//       { name: 'Token', icon:  <SupportAgentIcon />,
//        hasDropdown: true,
//       subItems: [
//         { name: 'Tokens List', path: '/tokens' },
//         { name: 'Summary Tokens List', path: '/summary-tokens' },
//       ]  },
//     // { name: 'Business', icon: <ApartmentIcon />, path: '/register-business' },
//     // { name: 'Tickets', icon: <SupportAgentIcon />, path: '/help-center' },
//     { name: 'Refer & Earn', icon: <Diversity3Icon />, path: '/refer-earn' },
//     {
//       name: 'Invoices',
//       icon: <RequestQuoteIcon />,
//       hasDropdown: true,
//       subItems: [
//         // { name: 'Dashboard', path: '/invoice-dashboard' },
//         { name: 'Original Invoices', path: '/original-invoices' },
//         { name: 'Recurring Invoices', path: '/recurring-invoices' },
//         // { name: 'Toast Demo', path: '/demo' },
//       ]
//     },
//   ];

//   const handleMouseEnter = (event: React.MouseEvent<HTMLElement>, item: any) => {
//     if (!isOpen && item.subItems) {
//       setAnchorEl(event.currentTarget);
//       setHoveredItem(item);
//     }
//   };

//   const handleMouseLeave = () => {
//     setAnchorEl(null);
//     setHoveredItem(null);
//   };

//   return (
//     <Box
//       className={`user-sidebar ${isOpen ? 'open' : 'closed'}`}
//       sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary,
//         boxShadow: theme.shadows[2],
//         width: isOpen ? 200 : 60,
//         overflow: 'visible',
//         position: 'relative',
//         zIndex: 1201,
//       }}
//     >
//       {/* Header */}
//       <Box className={`user-sidebar-header ${isOpen ? 'open' : 'closed'}`} sx={{ p: 2 }}>
//         {isOpen && (
//           <Box className='header-comp'>
//             <img
//               className='logo-img'
//               src="../logo.png"
//               alt="Logo"
//             />
//             <Typography
//               variant="h6"
//               sx={{ color: theme.palette.text.primary }}
//             >
//               QUICK CASH
//             </Typography>
//           </Box>
//         )}
//         <IconButton onClick={toggleSidebar} size="small">
//           <MenuIcon />
//         </IconButton>
//       </Box>

//       <List sx={{ p: 1 }}>
//         {menuItems.map((item) => {
//           const isHovered = hoveredItem?.name === item.name;

//           return (
//             <Box
//               key={item.name}
//               onMouseEnter={(e) => handleMouseEnter(e, item)}
//               onMouseLeave={handleMouseLeave}
//               sx={{ position: 'relative' }}
//             >
//               <ListItem
//                 button
//                 className={clsx('menu-item', { 'active': location.pathname === item.path })}
//                 onClick={() => {
//                   if (item.hasDropdown) {
//                     if (isOpen) {
//                       setOpenDropdown(openDropdown === item.name ? null : item.name);
//                     }
//                   } else if (item.path) {
//                     navigate(item.path);
//                   }
//                 }}
//               >
//                 <ListItemIcon className='menu-list-item'>
//                   <span className="material-icons" style={{color: theme.palette.text.primary,}}>{item.icon}</span>
//                 </ListItemIcon>

//                 {isOpen && (
//                   <>
//                     <ListItemText
//                       className="menu-items-text"
//                       primary={item.name}
//                       classes={{ primary: 'menu-items-text-root' }}
//                     />
//                     {item.hasDropdown && (
//                       <ExpandMoreIcon
//                         className={clsx('expand-more-icon', {
//                           expanded: openDropdown === item.name,
//                         })}
//                       />
//                     )}
//                   </>
//                 )}
//               </ListItem>

//               {/* Expanded mode dropdown */}
//               {isOpen && openDropdown === item.name && item.subItems && (
//                 <List className="submenu">
//                   {item.subItems.map((sub: any) => (
//                     <ListItemButton
//                       key={sub.name || sub}
//                       className={clsx('submenu-item', {
//                         'active': location.pathname === sub.path
//                       })}
//                       onClick={() => {
//                         if (sub.path) {
//                           navigate(sub.path);
//                           // setOpenDropdown(null);
//                         }
//                       }}
//                     >
//                       <ListItemText
//                         primary={sub.name || sub}
//                         className="submenu-text"
//                       />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               )}

//               {/* Tooltip for collapsed sidebar (on hover) */}
//               {!isOpen && isHovered && item.subItems && (
//                 <Popper
//                   open={true}
//                   anchorEl={anchorEl}
//                   placement="right-start"
//                   modifiers={[{ name: 'offset', options: { offset: [0, 4] } }]}
//                   style={{ zIndex: 2000 }}
//                 >
//                   <Paper
//                     className='tooltip-paper'
//                     sx={{ pointerEvents: 'auto' }}
//                   >
//                     <Typography>{item.name}</Typography>
//                     <ul className="tooltip-submenu">
//                       {item.subItems.map((sub: any) => (
//                         <li
//                           key={sub.name || sub}
//                           className="tooltip-submenu-item"
//                           style={{ cursor: 'pointer' }}
//                           onClick={() => {
//                             if (sub.path) {
//                               navigate(sub.path);
//                               handleMouseLeave();
//                             }
//                           }}
//                         >
//                           {typeof sub === 'string' ? sub : sub.name}
//                         </li>
//                       ))}
//                     </ul>
//                   </Paper>
//                 </Popper>
//               )}
//             </Box>
//           );
//         })}
//       </List>

//     </Box>
//   );
// };

// export default Sidebar;
