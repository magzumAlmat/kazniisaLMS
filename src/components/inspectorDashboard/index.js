import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBanners,
  getAllCompanies,
  getBannerByCompanyIdAction,
  getUserInfo,
  getAllRevises
} from "@/store/slices/authSlice";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { addCompanyAction } from "@/store/slices/authSlice";
import ReviseDashboard from "../reviseDashboard";
import { Button } from "reactstrap";
import { useRouter } from "next/navigation";
import { Map,Marker } from "@2gis/mapgl/types";
export default function InspectorDashboard() {
    const router=useRouter()
  const host = "http://localhost:8000";
  const token = localStorage.getItem("token");
  const TOKEN = useSelector((state) => state.auth.authToken);
  const CurrentCompany = useSelector((state) => state.auth.currentCompany);
  
  let decodedToken = jwtDecode(token);
  console.log("1 decoded token from home", decodedToken);
  const CompanyId = decodedToken.companyId;
  const dispatch = useDispatch();
  const banners = useSelector((state) => state.auth.allBanners);
  const companies = useSelector((state) => state.auth.allCompanies);
  const allRevises = useSelector((state) => state.auth.allRevises);
  const bannersArray = [...banners];
  
  const companiesArray = [...companies];
  const itemsPerPage = 5;

  const [bannersState, setBannersState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(""); // New state for selected company
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    dispatch(getAllCompanies());
    dispatch(getAllBanners());
    
    dispatch(getAllRevises())

  }, [dispatch]);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(bannersArray.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  }


  const redirectToReviseDashboard=(bannderId)=>{
    console.log('BANNER ID afterClick=',bannderId)
    
    router.push(`/revise?bannderId=${bannderId}`)
    // router.push({
    //     pathname: '/revise',
    //     query: { id: bannderId },
    //   })
  }

  // Filter banners based on the selected company
  const filteredBanners = selectedCompany
    ? bannersArray.filter((banner) => banner.CompanyId == selectedCompany) // Use '==' instead of '==='
    : bannersArray;

  // Filter banners based on the search query
  const filteredBannersWithSearch = filteredBanners.filter((banner) =>
    banner.uniqueCode.includes(searchQuery)
  );

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBannersWithSearch.slice(indexOfFirstItem, indexOfLastItem); // Use 'filteredBannersWithSearch' here

  // allRevises.map((item)=>{
  //   console.log('revise=',item)
  // })
console.log('allrevises',allRevises)



const imageUrlArray =[]
 currentItems.map(item=>{
  console.log('imageUrlArray item=',item)
  
  console.log('imageUrlArray splitted paths',item.imageUrl.split(','))
  imageUrlArray.push(...item.imageUrl.split(','))
})


console.log('ARRAYofImages==',imageUrlArray)




  return (
    <div className="container">
      
      <h1></h1>
      
      {/* Dropdown select for filtering companies */}
      <div>
        <label>Select a Company:</label>
        <select value={selectedCompany} onChange={handleCompanyChange}>
          <option value="">All Companies</option>
          {companiesArray.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input field for searching by uniqueCode */}
      <br />
      <div>
        <label>Search by uniqueCode:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="container-fluid">
        <h1>Баннеры</h1>
        {currentItems.map((item) => {
          const matchingCompany = companiesArray.find(
            (company) => item.CompanyId == company.id // Use '==' instead of '==='
          );

        
          if (matchingCompany) {
            let date = new Date(item.expiredDate);
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        let formattedExpiredDate = date.toLocaleDateString('ru-RU', options);
            let date2 = new Date(item.createdDate);
                        const options2 = { year: 'numeric', month: 'long', day: 'numeric' };
                        let formattedCreatedDate = date.toLocaleDateString('ru-RU', options);
                      


            return (
              <div key={item.id} className="container mt-5 border mb-5">
                <div className="row p-3">
                  <div className="col-sm-2">
                    {/* {console.log('item.imageUrls=',`${host}/${item.imageUrl}`)} */}
                    {/* <img
                      style={{ width: "100%" }}
                      src={`${host}/${item.imageUrl}`}
                      alt="alt bannвer"
                    /> */}

                    {imageUrlArray.map((imageUrl, index) => (
                              <img width={90} height={120} key={index} src={`${host}/${imageUrl.trim()}`} alt={`Image ${index}`} />
                            ))}

                  </div>
                  <div className="col-sm-5">
                    <p>Banner title: {item.title}</p>
                    <p>Banner number: {item.bannerNumber}</p>
                    <p>Banner address: {item.banerAddress} </p>
                    <p>Banner unique code: {item.uniqueCode} </p>
                    <p>Banner createdDate: {formattedCreatedDate} </p>
                    <p>Banner expiredDate: {formattedExpiredDate} </p>
                    
                    <p>Company name: {matchingCompany.name}</p>
                    <p>Company description: {matchingCompany.description} </p>
                    <p>Company address: {matchingCompany.address}</p>
                    <p>Company bin: {matchingCompany.bin} </p>
                    <p>Company contactEmail: {matchingCompany.contactEmail} </p>
                    
                   
              
                  </div>
                  <div className="col-sm-5">

                  
                   
                   <h6>Проверка</h6>
                   {Array.isArray(allRevises) && allRevises.length > 0 ? (
                     allRevises.map((item2) => {
                      
                       if(item.id==item2.BannerId){
                        let date = new Date(item2.expiredDate);
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        let formattedDate = date.toLocaleDateString('ru-RU', options);

                      
                         return(<>
                          <div key={item2.id} className="">
                          <img
                     style={{ width: "100%" }}
                     src={`${host}/${item2.image}`}
                     alt="Banner"
                   />
                         <p>Статус: {item2.status}</p>
                         <p>Описание: {item2.description}</p>
                         <p>Конец аренды: {formattedDate}</p>
                         {/* Display other properties from 'item' here */}
                       </div>
                       </>)
                       }
                      
                 })
                   ) : (
                     <p>No revises found.</p>
                   )}

                
                

                    
                   {/* <p>Описание проверки: {allRevises.description}</p>
                   <p>Статус проверки: {allRevises.status}</p> */}
                  </div>
              

                </div>
                <button
                  variant="contained"
                  color="primary"
                  onClick={() => redirectToReviseDashboard(item.id)} // Pass a reference, not an invocation
                >
                  Создать проверку
                </button>
              </div>

            );
          } else {
            return null;
          }
        })}


      </div>

      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button className="page-link" onClick={() => handlePageChange(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}