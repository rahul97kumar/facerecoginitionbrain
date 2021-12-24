import React , {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecoginiton from './components/FaceRecoginiton/FaceRecoginiton';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from "react-tsparticles";



 const particlesInit = (main) => {
    console.log(main);

  };

  const particlesLoaded = (container) => {
    console.log(container);
  };



const particlesOptions = {
    background: {
          color: {
            value: "#0d47a1",
          },
        },
        interactivity: {
          events: {
            resize: false,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
  
        }



 const initialState = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedin:false,
      user: {
      id:'',
      name:'',
      email:'',
      password:'',
      entries:0,
      joined:''
      }  
      }     


class App extends Component{
  constructor() {
    super();
    this.state= initialState;
    }
  

  LoadUser = (data) => {
    this.setState( {user : {
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined: data.joined

    }}
    )
  }


  calculateFaceLocation =(data) => {
    const Clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : Clarifaiface.left_col * width,
      topRow : Clarifaiface.top_row * height,
      rightCol : width - (Clarifaiface.right_col * width),
      bottomRow : height - (Clarifaiface.bottom_row * height)
    }

  }


  displayFaceBox = (box) =>{
    this.setState({box:box})
  }



  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }



onButtonSubmit= () => {
  this.setState({imageUrl:this.state.input});
  fetch('https://obscure-atoll-86485.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-Type': 'application/json'},
      body : JSON.stringify({
       input: this.state.input
      })
    })
  .then(response => response.json())
.then(response=> {
  if(response) {
    fetch('https://obscure-atoll-86485.herokuapp.com/image',{
      method:'put',
      headers:{'Content-Type': 'application/json'},
      body : JSON.stringify({
       id:this.state.user.id
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user,{entries:count}))
    })
    .catch(console.log)
  }
  this.displayFaceBox(this.calculateFaceLocation(response))
})
.catch(err=> console.log(err));
}

onRouteChange = (route) => {
  if(route === 'signout'){
    this.setState(initialState)
  }
  else if (route === 'home'){
    this.setState({isSignedin:true})
  }
  this.setState({route: route});
}



  render(){
    const {isSignedin,imageUrl,box,route} = this.state;
 return (
  <div className='App'>
  <Particles
      className="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
    />
  <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
   {route === 'home' ?
   <div>
     <Logo />
     <Rank name={this.state.user.name} entries={this.state.user.entries} />
     <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
     <FaceRecoginiton box={box} imageUrl={imageUrl}/>
     </div>
     : (
        route === 'signin' 
        ?
            <SignIn LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/> 
            :
             <Register LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/> 
        )
 
    }

 </div>
 );
}
};

export default App;