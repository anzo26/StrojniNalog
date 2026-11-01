import { Card } from '../../../components/ui/Card'
import { LoadingState } from '../../../components/ui/LoadingState'
import { useUserProfile } from '../hooks/useUserProfile'
import { userRoleLabels } from '../models/authUser'

interface UserProfileCardProps {
  username: string
}

export function UserProfileCard({ username }: UserProfileCardProps) {
  const { profile, loading, error } = useUserProfile()

  if (loading) {
    return (
      <Card>
        <LoadingState message="Nalaganje profila …" />
      </Card>
    )
  }

  if (error || !profile) {
    return (
      <Card>
        <div role="alert">
          <h2>Profil ni na voljo</h2>
          <p>{error ?? 'Poskusite osvežiti stran.'}</p>
        </div>
      </Card>
    )
  }

  const displayName = `${profile.ime} ${profile.priimek}`.trim() || username

  return (
    <Card aria-labelledby="account-name">
      <h2 id="account-name">{displayName}</h2>
      <dl className="account-details">
        <div>
          <dt>Uporabniško ime</dt>
          <dd>{username}</dd>
        </div>
        <div>
          <dt>E-pošta</dt>
          <dd>{profile.email || 'Ni navedena'}</dd>
        </div>
        <div>
          <dt>Vloga</dt>
          <dd>
            {profile.vloge.map(role => userRoleLabels[role]).join(', ')
              || 'Brez poslovne vloge'}
          </dd>
        </div>
      </dl>
    </Card>
  )
}