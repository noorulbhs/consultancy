import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TeamMember, TeamService } from '../../services/team.service';

declare var bootstrap: any;

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  selectedMember: TeamMember | null = null;
  
  // Filters
  searchTerm: string = '';
  filterDepartment: string = 'all';
  filterStatus: string = 'all';
  sortBy: 'name' | 'role' | 'department' | 'joinDate' = 'name';

  constructor(private teamService: TeamService, public router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.teamService.getAll().subscribe(data => {
      this.members = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.members];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term) ||
        member.department.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term)
      );
    }

    // Apply department filter
    if (this.filterDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === this.filterDepartment);
    }

    // Apply status filter
    if (this.filterStatus === 'public') {
      filtered = filtered.filter(member => member.isPublic);
    } else if (this.filterStatus === 'private') {
      filtered = filtered.filter(member => !member.isPublic);
    } else if (this.filterStatus === 'featured') {
      filtered = filtered.filter(member => member.featured);
    } else if (this.filterStatus === 'admin') {
      filtered = filtered.filter(member => member.isAdmin);
    }

    // Apply sorting
    this.sortMembers(filtered);
    this.filteredMembers = filtered;
  }

  sortMembers(members: TeamMember[]) {
    members.sort((a, b) => {
      switch (this.sortBy) {
        case 'role':
          return a.role.localeCompare(b.role);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'joinDate':
          return new Date(b.joinDate || '').getTime() - new Date(a.joinDate || '').getTime();
        default: // name
          return a.name.localeCompare(b.name);
      }
    });
  }

  getDepartments(): string[] {
    const departments = new Set(this.members.map(member => member.department));
    return Array.from(departments).sort();
  }

  getPublicCount(): number {
    return this.members.filter(member => member.isPublic).length;
  }

  getFeaturedCount(): number {
    return this.members.filter(member => member.featured).length;
  }

  getAdminCount(): number {
    return this.members.filter(member => member.isAdmin).length;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  preview(member: TeamMember) {
    this.selectedMember = member;
    const modal = new bootstrap.Modal(document.getElementById('previewModal')!);
    modal.show();
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this team member? This action cannot be undone.')) {
      this.teamService.delete(id).subscribe(() => this.load());
    }
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }
}
