/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Appointments from './pages/Appointments';
import Community from './pages/Community';
import CommunityLeaderboard from './pages/CommunityLeaderboard';
import FindInvestors from './pages/FindInvestors';
import Home from './pages/Home';
import InvestorHome from './pages/InvestorHome';
import InvestorPitches from './pages/InvestorPitches';
import InvestorPortfolio from './pages/InvestorPortfolio';
import LearningHub from './pages/LearningHub';
import MeetingNotes from './pages/MeetingNotes';
import MyIdea from './pages/MyIdea';
import Profile from './pages/Profile';
import RoleSelect from './pages/RoleSelect';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Appointments": Appointments,
    "Community": Community,
    "CommunityLeaderboard": CommunityLeaderboard,
    "FindInvestors": FindInvestors,
    "Home": Home,
    "InvestorHome": InvestorHome,
    "InvestorPitches": InvestorPitches,
    "InvestorPortfolio": InvestorPortfolio,
    "LearningHub": LearningHub,
    "MeetingNotes": MeetingNotes,
    "MyIdea": MyIdea,
    "Profile": Profile,
    "RoleSelect": RoleSelect,
}

export const pagesConfig = {
    mainPage: "RoleSelect",
    Pages: PAGES,
    Layout: __Layout,
};