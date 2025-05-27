import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RickAndMortyUser {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  total = 0;
  vivos = 0;
  mortos = 0;
  desconhecidos = 0;
  especies: { [key: string]: number } = {};
  chartStatusData: any;
  chartSpeciesData: any;
  chartOptions: any;
  sparklineData: any;
  sparklineAliveData: any;
  sparklineDeadData: any;
  sparklineUnknownData: any;
  sparklineOptions: any;
  topContacts: RickAndMortyUser[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ results: RickAndMortyUser[] }>('https://rickandmortyapi.com/api/character').subscribe(data => {
      const users = data.results;
      this.total = users.length;
      this.vivos = users.filter(u => u.status === 'Alive').length;
      this.mortos = users.filter(u => u.status === 'Dead').length;
      this.desconhecidos = users.filter(u => u.status === 'unknown').length;
      this.especies = {};
      users.forEach(u => {
        this.especies[u.species] = (this.especies[u.species] || 0) + 1;
      });
      this.chartStatusData = {
        labels: ['Vivos', 'Mortos', 'Desconhecidos'],
        datasets: [
          {
            label: 'Status',
            backgroundColor: ['#00ffb3', '#ff4c4c', '#baffd9'],
            data: [this.vivos, this.mortos, this.desconhecidos]
          }
        ]
      };
      this.chartSpeciesData = {
        labels: Object.keys(this.especies),
        datasets: [
          {
            data: Object.values(this.especies),
            backgroundColor: ['#00ffb3', '#4cffb3', '#ffb34c', '#baffd9', '#ff4c4c', '#a3a3ff', '#ff8c4c']
          }
        ]
      };
      this.chartOptions = {
        plugins: {
          legend: { labels: { color: '#baffd9' } }
        },
        scales: {
          x: { ticks: { color: '#baffd9' }, grid: { color: '#23233a' } },
          y: { ticks: { color: '#baffd9' }, grid: { color: '#23233a' } }
        }
      };
      // Dados fake para sparklines (poderia ser histórico real)
      this.sparklineData = {
        labels: [1,2,3,4,5,6,7],
        datasets: [{ data: [this.total-2, this.total-1, this.total, this.total-1, this.total, this.total-2, this.total], borderColor: '#4cffb3', fill: false, tension: 0.4 }]
      };
      this.sparklineAliveData = {
        labels: [1,2,3,4,5,6,7],
        datasets: [{ data: [this.vivos-1, this.vivos, this.vivos-2, this.vivos, this.vivos-1, this.vivos, this.vivos-2], borderColor: '#00ffb3', fill: false, tension: 0.4 }]
      };
      this.sparklineDeadData = {
        labels: [1,2,3,4,5,6,7],
        datasets: [{ data: [this.mortos, this.mortos-1, this.mortos, this.mortos-2, this.mortos, this.mortos-1, this.mortos], borderColor: '#ff4c4c', fill: false, tension: 0.4 }]
      };
      this.sparklineUnknownData = {
        labels: [1,2,3,4,5,6,7],
        datasets: [{ data: [this.desconhecidos, this.desconhecidos-1, this.desconhecidos, this.desconhecidos-2, this.desconhecidos, this.desconhecidos-1, this.desconhecidos], borderColor: '#baffd9', fill: false, tension: 0.4 }]
      };
      this.sparklineOptions = {
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        elements: { point: { radius: 0 } },
        responsive: true,
        maintainAspectRatio: false
      };
      this.topContacts = users.slice(0, 5);
    });
  }
}
