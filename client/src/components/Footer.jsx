import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <nav aria-label="Нижня навігація">
          <ul className="nav-list">
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/catalog">Каталог</Link></li>
            <li><Link to="/contacts">Контакти</Link></li>
            <li><Link to="/manage">Керування місцями</Link></li>
          </ul>
        </nav>
        <address>
          <a href="mailto:yana.kushneryk.volod@fclnup.if.ua">yana.kushneryk.volod@fclnup.if.ua</a>
          <br />
          <a href="tel:+380951786891">+380951786891</a>
        </address>
        <p>
          <small>
            © <time dateTime="2026">2026</time> Простір. Навчальний проєкт.
          </small>
        </p>
      </div>
    </footer>
  )
}
