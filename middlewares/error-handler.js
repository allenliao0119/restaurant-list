module.exports = (error, req, res, next) => {
  console.log(error)
  req.flash('error', error.errorMsg || '系統錯誤')
  res.redirect('back')
  next(error)
}