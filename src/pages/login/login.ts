import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Home } from '../home/home';
import { Register } from '../register/register';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
	private form : FormGroup;
	
	constructor(public loadingCtrl: LoadingController, 
				public navCtrl: NavController, 
				private formBuilder: FormBuilder,
				public menuCtrl: MenuController){
					
		this.menuCtrl.enable(false);
					
		this.form = this.formBuilder.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.required]
		});
	}
	
	crearCuenta(){
		this.navCtrl.push(Register);
	}
	
	loginForm(){
		this.cargando();
		setTimeout(() => {this.navCtrl.push(Home);}, 1000);
	}
  
	cargando() {
		let loader = this.loadingCtrl.create({
			content: "Por favor espere...",
			duration: 1000
		});
		loader.present();
	}
	
	public type = 'password';
	public showPass = false;
	showPassword() {
		this.showPass = !this.showPass;
		if(this.showPass){
		  this.type = 'text';
		} else {
		  this.type = 'password';
		}
	}
  
}
