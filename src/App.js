import Reac from 'react';
import {BrowserRouter, Routes ,Route,Switch} from 'react-router-dom';
import './components/css/style.css';
import './App.css';
import Home from './components/pages/home/home.js';
import Login from './components/pages/login/Login.js';
import Signup from './components/pages/signup/Signup.js';
import Configure from './components/pages//configure/Configure.js';
import Dashboard from './components/pages/dashboard/Dashboard.js';
import Demodatareport from './components/pages/demodatareport/Demodatareport.js';
import Uploadclientform from './components/pages/Uploadclientform/Uploadclientform.js';
import Bankform from './components/pages/bankform/Bankform.js';
import Editprofile from './components/pages/editprofile/Editprofile.js';
import Hardwareprofile from './components/pages/hardwareprofile/Hardwareprofile.js';
import Clientinformation from './components/pages/clientinformation/Clientinformation.js';
import Trainerinformation from './components/pages/trainerinformation/Trainerinformation.js';
import Createdata from './components/pages/createdata/Createdata';
import Privateroute from './components/component/Privateroute.js';
import CreatesaveDatasession from './components/pages/createdata/CreatesaveDatasession';
import CreatesaveFilesession from './components/pages/createdatafile/Createdatafile';
import Viewpdfreport from './components/pages/viewpdfreport/Viewpdfreport';
import Viewdatareport from './components/pages/viewdatareport/Viewdatareport';
import Viewlive from './components/pages/viewlive/Viewlive';
import Viewmanageform from './components/pages/viewmanageform/Viewmanageform';
import Viewcreate from './components/pages/viewcreate/Viewcreate';
import Sectionreportassembly from './components/pages/sectionreportassembly/Sectionreportassembly';
import Subscriptionmanagement from './components/pages/subscriptionmanagement/Subscriptionmanagement';
import Recording from './components/pages/recording/Recording';
import Uploadtrainnerform from './components/pages/uploadtrainnerform/Uploadtrainnerform';
import Dropdown from './components/pages/Dropdown';
import Viewuploadedclientform from './components/pages/Uploadclientform/Viewuploadedclientform';
import Viewuploadedtrainerform from './components/pages/uploadtrainnerform/Viewuploadedtrainerform';
import Viewcompletedclientwork from './components/pages/viewcompletedclientwork/Viewcompletedclientwork';
import Editclient from './components/pages/clientinformation/Editclient';
import Edittrainer from './components/pages/trainerinformation/Edittrainer';
import Groupinformation from './components/pages/groupinformation/Groupinformation';
import Editgroupinformation from './components/pages/groupinformation/Editgroupinformation';
import Editgroup from './components/pages/groupinformation/Editgroup';
import Creategroupsessetionreport from './components/pages/viewdatareport/Creategroupsessetionreport.js';
import Createmultisession from './components/pages/viewdatareport/Createmultisession';
import Groupsessiondatareport from './components/pages/createdata/Groupsessiondatareport.js';
import Chart from './components/pages/chart/Chart';
import ExportChart from './components/pages/exportedchart/ExportedChart';
import ChartTable from './components/pages/chartTable/ChartTable';
import ChartExportedTable from './components/pages/chartexportedTable/ExportchartTable';
import SessiondataReport from './components/pages/viewdatareport/SessiondataReport';
import MultidataReport from './components/pages/viewdatareport/MultidataReport';
import Clienthomeworkdatareport from './components/pages/viewdatareport/Clienthomeworkdatareport';
import PdfsessionReport from './components/pages/viewpdfreport/PdfsessionReport';
import PdfmultisessionReport from './components/pages/viewpdfreport/PdfmultisessionReport';
import GroupsesstionReport from './components/pages/viewpdfreport/GroupsesstionReport';
import PdfclienthomeworkReport from './components/pages/viewpdfreport/PdfclienthomeworkReport';
import PdfsessetionreportNotes from './components/pages/viewpdfreport/PdfsessetionreportNotes';
import Assemblyreport from './components/pages/sectionreportassembly/Assemblyreport';
import Viewassemblyreport from './components/pages/sectionreportassembly/Viewassemblyreport';
import Privateroutelogin from './components/component/Privateroutelogin';
import Uploadhomeworkasignment from './components/pages/viewmanageform/Uploadhomeworkasignment';
import Addclient from './components/pages/clientinformation/Addclient';
import Addtrainer from './components/pages/trainerinformation/Addtrainer';
import Multilanguage from './components/component/Multilanguage';
import SubscriptionRenewal from './components/pages/subscriptionmanagement/SubscriptionRenewal';
import Chooseemail from './components/pages/choose/Chooseemail';
import List from './components/pages/list/List';
import SubscriptionRenewalGroup from './components/pages/subscriptionmanagement/SubscriptionRenewalGroup';
import SubscribedUsers from './components/pages/subscribedusers/SubscribedUsers';
import Editassemblyreport from './components/pages/sectionreportassembly/Editassemblyreport';
import ViewChartTable from './components/pages/chartTable/ViewChartTable';
import GroupChartTable from './components/pages/chartTable/GroupChartTable';
import ViewGroupChartTable from './components/pages/chartTable/ViewGroupChartTable';
import MultiChartTable from './components/pages/chartTable/MultiChartTable';
import Vieweditassemblyreport from './components/pages/sectionreportassembly/Vieweditassemblyreport';
import Mantainance from './components/pages/login/Mantainance';
import Viewgroupinformation from './components/pages/groupinformation/Viewgroupinformation';
import ResetPassword from './components/pages/resetpassword/ResetPassword';

function App(){
	return(
		<BrowserRouter>			
			<Routes>
				 <Route path="" element={<Privateroute />}>
				<Route  path="/signup" element={<Signup />} />
				<Route  path="/configure" element={<Configure />} />
				<Route  path="/dashboard" element={<Dashboard />} />
				<Route  path="/demodatareport" element={<Demodatareport />} />
				{/* <Route  path="/demodatafile" element={<Demodatafile />} /> */}
				<Route  path="/upload/client/form" element={<Uploadclientform />} />
				<Route  path="/bankform" element={<Bankform />} />
				<Route  path="/hardware/profile" element={<Hardwareprofile />} />
				<Route  path="/edit/client/:id" element={<Clientinformation />} />
				<Route  path="/edit/trainer/:trainerid" element={<Trainerinformation />} />
				<Route path="/choose/report/config" element={<CreatesaveDatasession />} />
				<Route path="/choose/exported/file/config" element={<CreatesaveFilesession />} />
				<Route  path="/view/pdf/report" element={<Viewpdfreport />} />
				<Route  path="/view/data/report" element={<Viewdatareport />} />
				<Route  path="/view/live" element={<Viewlive />} />
				<Route  path="/view/manageform" element={<Viewmanageform />} />
				<Route  path="/viewcreate" element={<Viewcreate />} />
				<Route  path="/addclient" element={<Addclient />} />
				<Route  path="/section/report/assembly" element={<Sectionreportassembly />} />
				<Route  path="/subscription/management" element={<Subscriptionmanagement />} />
				<Route  path="/dropdown" element={<Dropdown />} />
				<Route  path="/recording" element={<Recording />} />
				<Route  path="/upload/trainner/form" element={<Uploadtrainnerform />} />
				<Route  path="/view/uploaded/client/form" element={<Viewuploadedclientform />} />
				<Route  path="/view/completed/client/work" element={<Viewcompletedclientwork />} />
				<Route  path="/view/uploaded/trainer/form" element={<Viewuploadedtrainerform />} />
				<Route  path="/list/client" element={<Editclient />} />
				<Route  path="/edit/trainer" element={<Edittrainer />} />
				<Route  path="/group/information" element={<Groupinformation />} />
				<Route  path="/edit/group/information/:groupid" element={<Editgroupinformation />} />
				<Route  path="/view/group/information/:groupid" element={<Viewgroupinformation />} />
				<Route  path="/edit/group" element={<Editgroup />} />
				<Route  path="/createmultisession" element={<Createmultisession />} />
				<Route  path="/create/group/session/report" element={<Creategroupsessetionreport />} />
				<Route  path="/group/session/data/report" element={<Groupsessiondatareport />} />
				<Route  path="/chart" element={<Chart />} />
				<Route  path="/exportchart" element={<ExportChart />} />
				<Route  path="/view/multi/report/:showclock/:reportId" element={<MultiChartTable />} />
				<Route  path="/create/group/report/:showclock/:config/:session/:record/:currentConfig" element={<GroupChartTable />} />

				<Route  path="/create/report/:showclock/:config/:session/:record/:currentConfig" element={<ChartTable />} />
				<Route  path="/view/report/:showclock/:session/:reportId/:record" element={<ViewChartTable />} />
				<Route  path="/view/group/report/:showclock/:session/:reportId/:record" element={<ViewGroupChartTable />} />
				<Route  path="/create/exported/report/:config" element={<ChartExportedTable/>} />
				<Route  path="/session/data/report/:type" element={<SessiondataReport />} />
				<Route path="/multidata/report" element={<MultidataReport />} />
				<Route path="/client/homework/datareport" element={<Clienthomeworkdatareport />} />
				<Route path="/pdf/session/data/report/:pdftype" element={<PdfsessionReport />} />
				<Route path="/pdf/multisession/report" element={<PdfmultisessionReport />} />
				<Route path="/group/sesstion/report" element={<GroupsesstionReport />} />
				<Route path="/pdf/client/homework/report" element={<PdfclienthomeworkReport />} />
				<Route path="/pdf/sessetion/report/notes" element={<PdfsessetionreportNotes />} />
				<Route path="/assemblyreport" element={<Assemblyreport />} />
				<Route path="/view/assembly" element={<Viewassemblyreport />} />
				<Route path="/view/edit/assemblyreport/:vid" element={<Vieweditassemblyreport />} />
				
				<Route path="/upload/homework/asignment" element={<Uploadhomeworkasignment />} />
				<Route path="/add/trainer" element={<Addtrainer />} />
				<Route path="/multilanguage" element={<Multilanguage />} />
			    <Route  path="/" element={<Createdata />} />
{/* 
				<Route path="/add/list" element={<Chooseemail />} />
				<Route path="/" element={<List />} />
				<Route path="/subscribe/user" element={<SubscribedUsers />} />
				 */}
				</Route> 
				<Route path="/subscription/renew/:userid" element={<SubscriptionRenewal />} />
				<Route path="/subscription/renew/group/:userid" element={<SubscriptionRenewalGroup />} />
				<Route path="/edit/assembly/report/:id" element={<Editassemblyreport />} />
				

				<Route  path="/edit/profile" element={<Editprofile />} /> 
			 	<Route path="" element={<Privateroutelogin />}>
		 
				<Route path="/login" element={<Login />} />
				
				
				{/* <Route path="/login" element={<Mantainance />} /> */}
				</Route>
				<Route path="/reset/password" element={<ResetPassword />} />
				
			</Routes>
	</BrowserRouter>
	)
}

export default App;
