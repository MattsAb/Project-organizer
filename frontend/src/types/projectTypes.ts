import type { User } from "./authTypes"

export type ProjectRole =
  | 'OWNER'
  | 'ADMIN'
  | 'MEMBER'

type ProjectAssignmentType = {
  id: number
  title: string
  assignees: MemberType[]
}

export type DashboardProjectType = {
  id: number
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

export type MyProjectType = Project & {
  _count: {
    members: number
    assignments: number
  }
}

export type MemberType = {
    id: number
    user: User
    role: ProjectRole
    joinedAt: string
}