import PropTypes from "prop-types";

export const Header = ({ onSubmit }) => {
  return (
    <div className="header">
      <h1>Kanban</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="board_name">Board Name</label>
        <input type="text" name="board_name" id="board_name" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

Header.propTypes = {
  onSubmit: PropTypes.func,
};
