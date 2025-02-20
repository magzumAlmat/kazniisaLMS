import { createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';
import END_POINT from '@/components/config/index';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch


const initialState = {
  isAuth: false,
  currentUser: null,
  currentCompany:null,
  someVar: 'blah blah blah',
  authToken: '',
  codeFromServer:'none',
  bannersById:'',
  allBanners:'',
  allCompanies:[],
  allRevises:'',
  error:'',
  uploadProgress: 0,
  courses:[],
  currentCourse:[],
};
const token = localStorage.getItem('token');

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,

//   reducers: {
//     authorize: (state, action) => {
//       localStorage.setItem('token', action.payload.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
//       // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
//       const decoded = jwt_decode(action.payload.token);

//       state.currentUser = {
//         id: decoded.id,
//         email: decoded.email,
//         name: decoded.name,
//         username: decoded.username,
//         password: decoded.password,
//       };
//       state.isAuth = true;
//     },

  


//     logout: (state) => {
//       // Clear user-related state when logging out
//       localStorage.removeItem('token'); // Remove the token from localStorage
//       axios.defaults.headers.common['Authorization'] = ''; // Remove Authorization header
//       state.currentUser = null;
//       state.isAuth = false;
//     },
//   },
// });


export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    sendErrorReducer:(state,action)=>{
      // console.log('sendErrorReducer error=',action)
      console.log('sendErrorReducer error=',action.payload)
      state.error=action.payload
    },

    loginReducer:(state,action)=>{
     
              localStorage.setItem('token', action.payload.token);
              axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
              // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
              const decoded = jwt_decode(action.payload.token);
        
              console.log('decoded data = ',decoded)
              state.currentUser = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                username: decoded.username,
                password: decoded.password,
              };
              state.isAuth = true;
              console.log('this is currentUser- ',state.currentUser,'isAuth=',state.isAuth)
            },

    ReviseReducer:(state,action)=>{
      console.log('1.3 ReviseReducer',action.payload)
      state.allRevises=action.payload
      
    },    
    getAllRevisesReducer:(state,action)=>{
      console.log('1.3 ReviseReducer',action.payload)
      state.allRevises=action.payload
      
    },   
    getAllCompaniesReducer:(state,data)=>{
      const existingPostIds = state.allCompanies.map(post => post.id);
      // Фильтруйте новые посты, чтобы исключить дубликаты
      const newPosts = data.payload.filter(newPost => !existingPostIds.includes(newPost.id));
      console.log('New posts from reducer', newPosts)
      // Добавьте только новые посты в state.allPosts
      state.allCompanies.push(...newPosts);
      console.log('All companies from reducer', state.allCompanies)



      // console.log('1.3 getAllBannersReducerr-',action.payload)
      // state.allCompanies.push(...action.payload)

      
    },        
    getAllBannersReducer:(state,action)=>{
      console.log('1.3 getAllBannersReducerr-',action.payload)
      state.allBanners=action.payload
      console.log('1.3 getAllBannersReducer-',state.bannersById)
    },
    getBannerByCompanyIdReducer:(state,action)=>{
      console.log('1.3 getBannerByCompanyIdReducer-',action.payload)
      state.bannersById=action.payload
      console.log('1.3 getBannerByCompanyIdReducer-',state.bannersById)
    },

    setCurrentUser:(state,action)=>{
      console.log('1.3 setCurrentUser',action.payload)
      state.currentUser=action.payload
      console.log('1.4 CURRENT  USER CHANGED IN setCurrentUser',state.currentUser)
      state.currentCompany = action.payload.companyId;

    },

    authorize: (state, action) => {

      state.someVar=action.payload
      state.authToken=null
      state.authToken=action.payload
      
      // console.log('PAYLOAD=',action.payload.token,'codeFromServer=',state.currentUser)

      // const decoded = jwt_decode(action.payload.token);
      // console.log('1 authorize decoded token=========', decoded)

      
      
      // localStorage.setItem("token", action.payload.token);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      // // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`; // Add space after 'Bearer'
    
      // const decoded = jwt_decode(action.payload.token);
      // console.log('decoded token=========', decoded)


        // };
      
    },

    loginAuthorize: (state, action) => {

      state.someVar=action.payload
      console.log('PAYLOAD=',action.payload,'codeFromServer=',state.currentUser)
    },

    sendCodeReducer: (state, action) => {
      // console.log('SendCodeReducer token from profileMyposts'.action.payload)
      localStorage.setItem("token", action.payload.token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`; // Add space after 'Bearer'
    
      const decoded = jwt_decode(action.payload.token);
      console.log('decoded token=========', decoded)

      

      state.authToken = {
        id: decoded.id,
        email: decoded.email,
        code:decoded.code,
        name:decoded.name,
        phone:decoded.phone,
        lastname:decoded.lastname,
        companyId:decoded.companyId,
      };

      state.currentUser = {
        id: decoded.id,
        email: decoded.email,
        code:decoded.code,
        name:decoded.name,
        phone:decoded.phone,
        lastname:decoded.lastname,
        companyId:decoded.companyId,
      };
      state.isAuth = true;
  },


  sendUserDataReducer: (state, action) => {
    console.log(' 1 SendDataReducer token from sendDataUserReducer',action.payload)
    
    state.currentUser=action.payload
    console.log(' 2 SendDataReducer state changed',state.currentUser)
    

  //   state.currentUser = state.allPosts.map(item => {
  //     if(item.id === data.payload.postId) {
  //         item.commentaries.push(data.payload)
  //         return item
  //     } 
  //     return item

  // })

    // localStorage.setItem("token", state.currentUser);
    
    // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    
  
    
    // console.log('decoded token=========', localStorage.getItem("token"))

    


    // state.currentUser = {
    //   id: decoded.id,
    //   email: decoded.email,
      
    // };
    // state.isAuth = true;
},
      addCompanyReducer: (state, action) => {
        // state.currentCompany = action.payload;
        console.log('AddCompanyReducer Started', action.payload)
      },


      logout: (state) => { // Clear user-related state when logging out
          console.log('Logut start')
          localStorage.removeItem('token'); // Remove the token from localStorage
          axios.defaults.headers.common['Authorization'] = ''; // Remove Authorization header
          state.currentUser = null;
          state.isAuth = false;
          state.authToken = null;
      },

      getAllCoursesReducer:(state, action) => {
        state.courses=action.payload
  },
  getCurrentCoursesReducer:(state, action) => {
    state.currentCourse=action.payload
}

}

 
    });



// Action creators are generated for each case reducer function
export const { getAllCoursesReducer,setError,clearError,setUploadProgress,
  clearUploadProgress,sendErrorReducer,getCurrentCoursesReducer,
  getAllRevisesReducer,ReviseReducer,authorize, logout, editVar ,
  sendCodeReducer,sendUserDataReducer,setCurrentUser,
  getBannerByCompanyIdReducer,getAllBannersReducer, 
  loginReducer,addCompanyReducer,getAllCompaniesReducer} = authSlice.actions;

// Use useEffect for token initialization
// export const useTokenInitialization = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (token) {
//       let decodedToken = jwt_decode(token);

//       // Create a new state object and set properties
//       const newState = {
//         ...initialState,
//         isAuth: true,
//         currentUser: {
//           id: decodedToken.id,
//           email: decodedToken.email,
//           name: decodedToken.name,
//           password: decodedToken.password,
//           username: decodedToken.username,
//         },
//       };


//       axios.post(`${END_POINT}/api/auth/login`, {
//         email: decodedToken.email,
//         password: decodedToken.password,
//       }).then((res) => {
//         dispatch(login(res.data));
//       });

//       // Dispatch the login action with the new state
//       dispatch(login(newState));
//     } else {
//       localStorage.removeItem('token');
//     }
//   }, [token, dispatch]);

//   console.log('Token не найден');
//   return null;
// };


export const  getCourseByIdAction = (id) => async(dispatch) => {
  console.log('1 getCourseByIdAction started  id=',id)
  
  const response = await axios.get(
    `http://localhost:4000/api/courses/${id}`,{
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      //   'Content-Type': 'application/json', 
      // },
    }
  ).then((response) => {
    console.log('1.2 getcoursebyid response ',response.data)
    dispatch(getCurrentCoursesReducer(response.data));
  });
};


export const  getAllCoursesAction= () => async(dispatch) => {
  console.log('1 getAllRevises started')
  
  const response = await axios.get(
    `${END_POINT}/api/courses`,{
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      //   'Content-Type': 'application/json', 
      // },
    }
  ).then((response) => {
    console.log('1.2 getAllCompanies response ',response.data)
    dispatch(getAllCoursesReducer(response.data));
  });
};

export const  getAllCompanies= () => async(dispatch) => {
  console.log('1 getAllBanner started', token)
  
  const response = await axios.get(
    `${END_POINT}/api/auth/getallcompanies`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getAllCompanies RESPONSE ',response.data)
    dispatch(getAllCompaniesReducer(response.data));
  });
};

export const  getAllBanners= () => async(dispatch) => {
  console.log('1 getAllBanner started')
  
  const response = await axios.get(
    `${END_POINT}/api/banner/getall`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getBannerByCompanyId response ',response.data)
    dispatch(getAllBannersReducer(response.data));
  });
};


export const  getBannerByCompanyIdAction= (companyId) => async(dispatch) => {
  console.log('1 getBannerByCompanyId started')
  console.log('1.1 COMPANYID======', companyId)
  const response = await axios.get(
    `${END_POINT}/api/banner/getbycompanyid/${companyId}`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getBannerByCompanyId response ',response.data)
    dispatch(getBannerByCompanyIdReducer(response.data));
  });
};

export const  getUserInfo=async(dispatch)=>{
  
  console.log('1 getUserInFo started')
  const response = await axios.get(
    `${END_POINT}/api/auth/getAuthentificatedUserInfo`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getUserInFo response ',response.data)
    dispatch(setCurrentUser(response.data));
  });
};



export const useTokenInitialization = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token); // Декодируем токен
        console.log('Decoded token on initialization:', decoded);

        dispatch(loginReducer({ token })); // Устанавливаем состояние currentUser
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token'); // Удаляем некорректный токен
      }
    }
  }, [dispatch]);
};




export const createUserAction = ({email, password} ) => async (dispatch) => {
  console.log('1 createUser запустился ', email, password);
  dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

  try {
    // Проверка, существует ли пользователь с таким email
    const checkUserResponse = await axios.get(`http://localhost:4000/api/auth/check-email?email=${email}`);
    
    if (checkUserResponse.data.exists) {
      
      // Если пользователь с таким email уже существует
      dispatch({
        type: 'REGISTER_USER_FAILURE',
        payload: 'Пользователь с таким email уже существует',
      });
      console.log('Существует такой email')
      return; // Прерываем выполнение функции
    }

    // Если пользователя с таким email нет, продолжаем регистрацию
    await axios.post('http://localhost:4000/api/register', {
       email,
     
      password,
      roleId: 2,
    });


  } catch (error) {
    // Обработка ошибок сети или сервера
    dispatch({
      type: 'REGISTER_USER_FAILURE',
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const createTeacherAction = ({email, password} ) => async (dispatch) => {
  console.log('1 createUser запустился ', email, password);
  dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

  try {
    // Проверка, существует ли пользователь с таким email
    const checkUserResponse = await axios.get(`http://localhost:4000/api/auth/check-email?email=${email}`);
    
    if (checkUserResponse.data.exists) {
      
      // Если пользователь с таким email уже существует
      dispatch({
        type: 'REGISTER_USER_FAILURE',
        payload: 'Пользователь с таким email уже существует',
      });
      console.log('Существует такой email')
      return; // Прерываем выполнение функции
    }

    // Если пользователя с таким email нет, продолжаем регистрацию
    await axios.post('http://localhost:4000/api/register', {
       email,
     
      password,
      roleId: 3,
    });


  } catch (error) {
    // Обработка ошибок сети или сервера
    dispatch({
      type: 'REGISTER_USER_FAILURE',
      payload: error.response?.data?.error || error.message,
    });
  }
};

// export const createTeacherAction = ({email, password}) => async(dispatch) => {
//   console.log('1 creatTeacher запустился ', email, password);
//   dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

//   try {
//     // Отправка данных на сервер
//     const response = await axios.post('http://localhost:4000/api/auth/sendmail', {
//         email: email,
//         name: 'notcompleted',
//         lastname: 'notcompleted',
//         phone:'+2342454535',
//         password: password,
//         roleId:3
//     });

//     // Если регистрация успешна
//     if (response.status === 201) {
//       dispatch({
//         type: 'REGISTER_USER_SUCCESS',
//         payload: response.data.message, // Сообщение от сервера
//       });
//     } else {
//       // Если сервер вернул ошибку
//       dispatch({
//         type: 'REGISTER_USER_FAILURE',
//         payload: response.data.error || 'Ошибка при регистрации',
//       });
//     }
//   } catch (error) {
//     // Обработка ошибок сети или сервера
//     dispatch({
//       type: 'REGISTER_USER_FAILURE',
//       payload: error.response?.data?.error || error.message,
//     });
//   }
//   // await axios.post(`http://localhost:4000/api/auth/sendmail`, {
//   //   email: email,
//   //   name: 'not completed',
//   //   lastname: 'not completed',
//   //   phone:'2342454535',
//   //   password: password,

//   // }).then((res) => {
//   //   dispatch(authorize(res.data));
//   // }).catch((error)=>{
//   //   console.log('error')
//   // });
// };



export const loginInspectorAction = (email,password) => async(dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
  console.log('loginAction  start',email,password)
  // console.log('1 AutheUser запустился ', email, password);
 await axios.post(`${END_POINT}/api/auth/login`, {
    email: email,
    password:password,
    
  }).then((res) => {
    console.log('response from loginAction ',res)
    dispatch(loginReducer(res.data));
  });
};

export const loginAction = ({email,password}) => async(dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;

  console.log('1 loginAction  start',email,password)
  // console.log('1 AutheUser запустился ', email, password);


 await axios.post(`http://localhost:4000/api/auth/login`, {
    email: email,
    password:password,
  }).then((res) => {
    console.log('response from loginAction ',res)
    dispatch(loginReducer(res.data));
  });
};





export const sendCodeToEmailAction = (email) => async(dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;

  // console.log('auth user start')
  // console.log('1 AutheUser запустился ', email, password);

 await axios.post(`${END_POINT}/api/auth/sendmail`, {
    email: email,
  }).then((res) => {
    console.log('response ',res)
    dispatch(authorize(res.data));
  });
};





export const verifyCodeAction = (email,code) => async (dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
  console.log('VerifuCodeAction started',email,typeof(email),code,typeof(code))
  // console.log('1 AutheUser запустился ', email, password);
 await axios.post(`${END_POINT}/api/auth/verifycode`, {
    email: email,
    fullcode:code
  }).then((res) => {
    console.log('response from verifyCodeAction ',res.data)
    localStorage.setItem('token',res.data)
    dispatch(sendCodeReducer(res.data));
  });
};




// export const addWatermarkToImageAction=(images)=>async(dispatch)=>{
  
// console.log('addWatermarkToImageAction Started images=',images)
//   const token = localStorage.getItem("token");


//   const formData = new FormData();
//   formData.append('images', images[0]);
//   formData.append('images', images[1]);
 

//   let sometext='text from shareFUNCTION'

//   // console.log('FORMDATA before pass to redux',formData)
//   // for (const value of formData.values()) {
//   //     console.log('addWatermarkToImageAction  formData Values',value);
//   //   }
//   // console.log('1 createPostSlice | createPostFunc запустился ');

//   if (!token) {
//     // Handle the case where the token is not available or invalid
//     console.error('Token not available');
//     return;
// }
 

  
 
//   try {
//     const data = {
//      images
//     };
//     console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.images)
//     const response = await axios.post(
//       `${END_POINT}/api/banner/addimagecode`,
//       formData,
//       {
//         headers: {
//           // 'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data', // Set the content type to JSON
//         },
//       }
//     );

//     console.log('Data uploaded successfully:', response.data);
//     // dispatch(sendUserDataReducer(response.data))

 
//     // Handle success, e.g., dispatch an action to update state
//   } catch (error) {
//     console.log('erro from auth Slicer=',error.response.data.message)
    
//       await dispatch(sendErrorReducer(error.response.data))
    

//     // Handle errors, e.g., by returning an error object or dispatching an error action
//     console.error('Error uploading data:', error);
//     // You can dispatch an error action here if needed.
//   }}



export const addWatermarkToImageAction = (images,updateUploadProgress) => async (dispatch) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('images', images[0]);
  formData.append('images', images[1]);

  if (!token) {
    console.error('Token not available');
    return;
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch(setUploadProgress(percentage));
        if (updateUploadProgress) {
          updateUploadProgress(percentage);
        }
      },
    };

    const response = await axios.post(
      `${END_POINT}/api/banner/addimagecode`,
      formData,
      config
    );

    console.log('Data uploaded successfully:', response.data);
    dispatch(sendUserDataReducer(response.data));
    dispatch(updateUploadProgress(100)); // Set the progress to 100% on success
  } catch (error) {
    console.error('Error uploading data:', error);
    await dispatch(sendErrorReducer(error.response.data));
  }
};









export const addFullProfileDataAction=(password,phone,name,lastname)=>async(dispatch)=>{
  console.log('addFullProfileDataAction started',password,phone,name,lastname)

  const token = localStorage.getItem("token");


  const formData = new FormData();
  formData.append('password', password);
  formData.append('phone', phone);
  formData.append('name', name);
  formData.append('lastname', lastname);

  let sometext='text from shareFUNCTION'

  // console.log('FORMDATA before pass to redux',formData)
  for (const value of formData.values()) {
      console.log('addFullProfileDataAction  formData Values',value);
    }
  // console.log('1 createPostSlice | createPostFunc запустился ');

  if (!token) {
    // Handle the case where the token is not available or invalid
    console.error('Token not available');
    return;
}
 

  
 
  try {
    const data = {
      password,
      phone,
      name,
      lastname,
    };
    console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.password)
    const response = await axios.post(
      `${END_POINT}/api/auth/addfullprofile`,
      data.password,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      }
    );

    console.log('Data uploaded successfully:', response.data);
    dispatch(sendUserDataReducer(response.data))

 
    // Handle success, e.g., dispatch an action to update state
  } catch (error) {
    console.log('erro from auth Slicer=',error.response.data.message)
    
      await dispatch(sendErrorReducer(error.response.data))
    

    // Handle errors, e.g., by returning an error object or dispatching an error action
    console.error('Error uploading data:', error);
    // You can dispatch an error action here if needed.
  }}

export const addCompanyAction=(name,description,bin,address,contactEmail,contactPhone,isUR)=>async(dispatch)=>{
    console.log('addFullProfileDataAction started',name,description,bin,address,contactEmail,contactPhone,isUR)
  
    const token = localStorage.getItem("token");
  
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('bin', bin);
    formData.append('address', address);
    formData.append('contactEmail', contactEmail);
    formData.append('contactPhone', contactPhone);
    formData.append('isUR', isUR);

    let sometext='text from shareFUNCTION'
  
    // console.log('FORMDATA before pass to redux',formData)
    for (const value of formData.values()) {
        console.log('addFullProfileDataAction  formData Values',value);
      }
  
  
    if (!token) {
      // Handle the case where the token is not available or invalid
      console.error('Token not available');
      return;
  }
   
  
    try {
      const data = {
        name,
        description,
        bin,
        address,
        contactPhone,
        contactEmail,
        isUR
      };
      console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.name)
      const response = await axios.post(
        `${END_POINT}/api/auth/createcompany`,
        data.name,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        }
      );
  
      
      console.log('Data uploaded successfully:', response.data);
      dispatch(addCompanyReducer(response.data))
      // Handle success, e.g., dispatch an action to update state
    } catch (error) {
      await dispatch(sendErrorReducer(error.response.data))
    
      // Handle errors, e.g., by returning an error object or dispatching an error action
      console.error('Error uploading data:', error);
      // You can dispatch an error action here if needed.
    }}


export const addBannerAction=(formData)=>async(dispatch)=>{
      console.log('addFullProfileDataAction started',formData)
    
      const token = localStorage.getItem("token");
    
    
      

     
      for (const value of formData.values()) {
        console.log('formData Values',value);
    }
      
      if (!token) {
        console.error('Token not available');
        return;
      }
      



      try {
        const response = await axios.post(
          `${END_POINT}/api/banner`,formData,{
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data', // Set the content type to 'multipart/form-data'
            },
          }
        );
      
        console.log('Data uploaded successfully:', response.data);
        // Handle success, e.g., dispatch an action to update state
      } catch (error) {
        console.error('Error uploading data:', error);
        // Handle errors, e.g., by returning an error object or dispatching an error action
      }
  

    }



    export const addReviseForBannerAction = (formData, bannerId) => async (dispatch) => {
      try {
        const token = localStorage.getItem('token');
    
        if (!token) {
          console.error('Token not available');
          return;
        }
    
        const response = await axios.post(`${END_POINT}/api/revise/${bannerId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Set the content type to 'multipart/form-data'
          },
        });
    
        console.log('Data uploaded successfully:', response.data);
    
        // Dispatch an action to update state or handle the response as needed
        dispatch(ReviseReducer(response.data));
      } catch (error) {
        console.error('Error uploading data:', error);
        // Handle errors, e.g., by returning an error object or dispatching an error action
      }
    };
    

    
export const logoutAction = () => (dispatch) => {
  // console.log('logoutAction started/');

  dispatch(logout());
};



export default authSlice.reducer;