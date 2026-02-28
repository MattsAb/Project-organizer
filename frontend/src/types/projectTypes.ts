import type { User } from "./authTypes"

type ProjectRole =
  | 'OWNER'
  | 'ADMIN'
  | 'MEMBER'

type ProjectAssignmentType = {
  title: string
  assignees: Member[]
}

export type DashboardProjectType = {
  title: string
  description: string
  assignments: ProjectAssignmentType[]
}

export type DashboardAssignmentType = {
    title: string
    description: string
    dueDate: string
    id: number
}

export type Project = {
    id: number
    title: string
    description: string
    numberOfMembers: number
    numberOfAssignments: number
}

export type Member = {
    id: number
    user: User
    role: ProjectRole
}