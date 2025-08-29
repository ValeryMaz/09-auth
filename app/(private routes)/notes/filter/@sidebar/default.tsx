import css from "./NotesSidebar.module.css";
import Link from "next/link";
const NotesSidebar = async () => {
  const categories = ["All", "Work", "Personal", "Meeting", "Shopping", "Todo"];
  return (
    <div className={css.menuContainer}>
      <ul className={css.menuList}>
        {categories.map((cat) => {
          return (
            <li className={css.menuItem} key={cat}>
              <Link href={`/notes/filter/${cat}`} className={css.menuLink}>
                {cat}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotesSidebar;
