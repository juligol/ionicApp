import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from "../../providers/global/global";
import { Home } from '../home/home';
import { Password } from '../password/password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
	private form : FormGroup;
	
	constructor(public navCtrl: NavController, 
				private formBuilder: FormBuilder,
				public menuCtrl: MenuController,
				private storage: Storage,
				public global: GlobalProvider){
					
		this.menuCtrl.enable(false);
					
		this.form = this.formBuilder.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.required]
		});
	}
	
	loginForm(){
		this.global.loading();
		this.form.value.action = "login";
		var myData = JSON.stringify(this.form.value);
		this.global.http.post(this.global.getLink(), myData).subscribe(data => {
			var usuario = JSON.parse(data["_body"]);
			if(usuario)
			{
				this.storage.set('user', usuario);
				this.global.user = usuario;
				this.navCtrl.setRoot(Home);
			}
			else
			{
				this.global.showMessage("Error", "E-mail o contraseña incorrectos!!");
			}
		}, 
		error => {
			this.global.showMessage('Error en login', error);
		});
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
	
	forgotPassword() {
		this.navCtrl.setRoot(Password);
	}
}
