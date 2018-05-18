import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Home } from '../home/home';
import { LoadingController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-viaje',
  templateUrl: 'viaje.html'
})

export class Viaje {
	viajeActual: any;
	map: any;
	directionsService: any = null;
	directionsDisplay: any = null;
	myLatLng: any;
	origen: any;
	destino: any;
	loader: any;

	constructor(public navCtrl: NavController, 
			    public navParams: NavParams,
			    private geolocation: Geolocation,
			    private storage: Storage,
				public alertCtrl: AlertController,
				public loadingCtrl: LoadingController) {
					
		this.loader = this.loadingCtrl.create({
			content: "Por favor espere...",
		});
		this.loader.present();		
		this.storage.get('user').then((val) => {
			console.log('Hola ' + val.nombre);
		});
				  
		// If we navigated to this page, we will have an item available as a nav param
		this.viajeActual = navParams.get('item');
		this.origen = this.viajeActual.origen;
		this.destino = this.viajeActual.destino;
		this.directionsService = new google.maps.DirectionsService();
		this.directionsDisplay = new google.maps.DirectionsRenderer();
		
		window.setInterval(this.guardarPosicionActual, 3000);
	}
  
	ionViewDidLoad(){
		this.getPosition();
	}
  
	getPosition():any{
		this.geolocation.getCurrentPosition().then(response => {
			this.loadMap(response);
		}).catch(error =>{
			console.log(error);
		})
	}
  
	loadMap(position: Geoposition){
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;
		console.log(latitude, longitude);
		
		// create a new map by passing HTMLElement
		let mapEle: HTMLElement = document.getElementById('map');
		let panelEle: HTMLElement = document.getElementById('panel');

		// create LatLng object
		this.myLatLng = {lat: latitude, lng: longitude};

		// create map
		this.map = new google.maps.Map(mapEle, {
		  center: this.myLatLng,
		  zoom: 12
		});
		
		this.directionsDisplay.setMap(this.map);
		this.directionsDisplay.setPanel(panelEle);
		
		google.maps.event.addListenerOnce(this.map, 'idle', () => {
		  let marker = new google.maps.Marker({
			position: this.myLatLng,
			map: this.map,
			title: 'Hello World!'
		  });
		  mapEle.classList.add('show-map');
		  this.calculateRoute();
		});
	}

	private calculateRoute(){
		this.directionsService.route({
			origin: this.myLatLng,
			destination: this.destino,
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls: true
		}, (response, status)=> {
			if(status === google.maps.DirectionsStatus.OK) {
				console.log(response);
				this.directionsDisplay.setDirections(response);
			}else{
				alert('No se pudieron cargar las direcciones debido a: ' + status);
			}
			//Esperar un cachito mas 
			setTimeout(() => {this.loader.dismiss();}, 1000);
		});  
	}
	
	guardarPosicionActual() {
		var link = 'http://mab.doublepoint.com.ar/config/ionic.php';
		/*var myData = JSON.stringify({action: "posicionActual", latitude: latitude, lng: longitude});
		this.http.post(link, myData).subscribe(data => {
			var viajes = JSON.parse(data["_body"]);
			console.log(viajes);
			if(viajes.length > 0)
			{
				this.viajes = viajes;
				this.viajesAux = viajes;
				this.inicializarListado(this.viajes);
			}
			this.loader.dismiss();
		}, 
		error => {
			console.log("Oooops!");
			this.loader.dismiss();
		});*/
	}
	
	finalizarViaje() {
		let alert = this.alertCtrl.create({
			title: 'Viaje ' + this.viajeActual.id,
			message: 'Desea finalizar este viaje?',
			buttons: [
			{
				text: 'Cancelar',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			},
			{
				text: 'Aceptar',
				handler: () => {
					this.cerrarViaje();
				}
			}
			]
		});
		alert.present();
	}
	
	cerrarViaje() {
		this.navCtrl.setRoot(Home);
		//Hacer los calculos
	}
}
