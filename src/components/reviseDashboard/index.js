import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBanners,
  getAllCompanies,
  getBannerByCompanyIdAction,
  getUserInfo,
} from "@/store/slices/authSlice";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { addCompanyAction } from "@/store/slices/authSlice";
import { Container,Row,Col } from "reactstrap";
import { addReviseForBannerAction } from "@/store/slices/authSlice";
import { useRef } from "react";
export default function ReviseDashboard(bannderId) {
  console.log('0 banerID=',bannderId)
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
  const bannersArray = [...banners];
  const companiesArray = [...companies];
  const itemsPerPage = 5;
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const [bannersState, setBannersState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(""); // New state for selected company
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    dispatch(getAllCompanies());
    dispatch(getAllBanners());
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(bannersArray.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }



  // Filter banners based on the selected company

  const [formData, setFormData] = useState({
    status: 'Не проверен',
    expiredDate: null,
    image: selectedFile,
    description: 'Нет описания',
    BannerId: '',
    UserId: '',
    moderatorStatus: '',
    moderatorAnswer: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Send the formData to your server or dispatch it to a Redux action
    console.log('formDATA',formData);
    await dispatch(addReviseForBannerAction(formData,bannderId.bannerId))

    
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    // Append the selected file to the formData
    const updatedFormData = { ...formData };
    updatedFormData.image = file;
    setFormData(updatedFormData);
  };


  const handleClick = () => {
    inputRef.current.click();
    console.log('handle click start', selectedFile);
  };

  return (
  

    <div >
       <h6>
  Cоздать проверку
  </h6>
       <Container>
 
  <Row xs="2">
    <Col className="bg-light border">
    {bannersArray.map((item, index) => {
            // console.log('item=',item.id,bannderId.bannerId            ),
         if( item.id == bannderId.bannerId      ){
          return(
          <>
           <div key={item.id} >
                <div >
                  <div className="col-sm-2">
                    <img
                      style={{ width: "100%" }}
                      src={`${host}/${item.imageUrl}`}
                      alt="alt bannder"
                    />
                  </div>
                  <div className="col-sm-10">
                    <p>Banner title: {item.title}</p>
                    <p>Banner number: {item.bannerNumber}</p>
                    <p>Banner address: {item.banerAddress} </p>
                    <p>Banner unique code: {item.uniqueCode} </p>

                    {/* <h6>Company name:{matchingCompany.name}</h6>
                    <p>Company address: {matchingCompany.address}</p>
                    <p>Company bin:{matchingCompany.bin} </p>
                    <p>Company contactEmail:{matchingCompany.contactEmail} </p>
                    <p>Company description:{matchingCompany.description} </p> */}
                  </div>
                </div>

              </div>
          </>
        )}
       

         
        })}
    </Col>
    <Col className="bg-light border">
    <form onSubmit={handleSubmit}>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Expired Date:</label>
          <input
            type="date"
            name="expiredDate"
            value={formData.expiredDate || ''}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label>Image:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div> */}
        <div>
                  <input
                    ref={inputRef}
                    onChange={handleFileChange}
                    type='file'
                    id='file'
                    style={{ display: 'none' }}
                  />
                  <button className='button button-primary' onClick={handleClick}>
                    Выберите фото
                  </button>
                  {selectedFile && (
                    <>
                      <p>Выбранный файл: {selectedFile.name}</p>
                      <img src={URL.createObjectURL(selectedFile)} alt='' width={400} height={300} />
                    </>
                  )}
                </div>
                
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div>
          <label>BannerId:</label>
          <input
            type="text"
            name="BannerId"
            value={formData.BannerId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>UserId:</label>
          <input
            type="text"
            name="UserId"
            value={formData.UserId}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div>
          <label>Moderator Status:</label>
          <input
            type="text"
            name="moderatorStatus"
            value={formData.moderatorStatus}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div>
          <label>Moderator Answer:</label>
          <input
            type="text"
            name="moderatorAnswer"
            value={formData.moderatorAnswer}
            onChange={handleChange}
            required
          />
        </div> */}
        <div>
          <button type="submit" onClick={()=>{alert('Проверка создана !')}} >Создать проверку</button>
        </div>
      </form>
    </Col>
  
  </Row>
  
  </Container>
      
      {/* Dropdown select for filtering companies */}
 
      

      {/* Input field for searching by uniqueCode */}
     

   

      {/* <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button className="page-link" onClick={() => handlePageChange(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
