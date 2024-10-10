

const changeLabelColor = (label) => {
  let id = ''
  if (label === 'Low Priority') {
    id = 'label-green';
  } else if (label === 'Medium Priority') {
    id = 'label-blue';
  } else if (label === 'High Priority') {
    id = 'label-red'
  }
  return id;
}

export default changeLabelColor;