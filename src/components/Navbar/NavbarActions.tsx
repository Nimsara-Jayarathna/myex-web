import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

interface NavbarActionsProps {
  itemClass: string
  iconClass: string
  onOpenSettings?: () => void
  onOpenReports?: () => void
  onLogout?: () => void
}

export const NavbarActions = ({
  itemClass,
  iconClass,
  onOpenSettings,
  onOpenReports,
  onLogout,
}: NavbarActionsProps) => (
  <div className="flex flex-wrap items-center justify-end gap-2">
    <button type="button" className={itemClass} onClick={onOpenReports}>
      <FontAwesomeIcon icon={faChartLine} className={iconClass} />
      Reports
    </button>
    <button type="button" className={itemClass} onClick={onOpenSettings}>
      <FontAwesomeIcon icon={faGear} className={iconClass} />
      Settings
    </button>
    <button type="button" className={itemClass} onClick={onLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} className={iconClass} />
      Logout
    </button>
  </div>
)

