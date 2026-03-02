
 type SenderNameType = {
    username: string
}
 type InviteProjectType = {
    title: string
  }

export type InviteType = {
    id: number
    invitedById: number
    projectId: number
    invitedUserId: number
    invitedBy: SenderNameType
    project: InviteProjectType
}

export type NotificationsType = {
        invites: number
}
