import { Project, ProjectStatus } from "../models/project";

type ProjectListener<T> = (projectList: T[]) => void;

// Project State Management
class State<T> {
  protected listeners: ProjectListener<T>[] = [];
  
  addListener(listenerFn: ProjectListener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private static instance: ProjectState;
  
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  private projects: Project[] = [];

  private constructor() { 
    super();
  }

  addProject(title: string, description: string, numberPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numberPeople, ProjectStatus.Active);

    this.projects.push(newProject);
    this.updateListeners();
  }
  
  moveProject(id: string, newStatus: ProjectStatus) {
    const target = this.projects.find(p => p.id === id);
    if (target && target.status !== newStatus) {
      target.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    this.listeners.forEach(fn => {
      fn(this.projects.slice());
    });
  }
}

export const projectState = ProjectState.getInstance();