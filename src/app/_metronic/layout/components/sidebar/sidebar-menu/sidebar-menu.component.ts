import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  logout() {
  // borrar usuario o token
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');

  // recargar o redirigir al login
  document.location.reload();
}


}
