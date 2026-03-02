import type { User } from "./authTypes"

export type ProjectRole =
  | 'OWNER'
  | 'ADMIN'
  | 'MEMBER'

type ProjectAssignmentType = {
  id: number
  title: string
  assignees: Member[]
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

export type Member = {
    id: number
    user: User
    role: ProjectRole
    joinedAt: string
}

export type InviteType = {
  invitedById: number
  projectId: number
  invitedUserId: number
}