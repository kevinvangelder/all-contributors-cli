const _ = require('lodash/fp')
const formatContributionType = require('./format-contribution-type')

const avatarTemplate = _.template(
  '<img src="<%= contributor.avatar_url %>" width="<%= options.imageSize %>px;"/>',
)
const avatarBlockTemplate = _.template(
  '[<%= avatar %><br /><sub><b><%= name %></b></sub>](<%= contributor.profile %>)',
)
const contributorTemplate = _.template(
  '<%= avatarBlock %><br /><%= contributions %>',
)

const defaultImageSize = 100

function defaultTemplate(templateData) {
  const avatar = avatarTemplate(templateData)
  const avatarBlock = avatarBlockTemplate(
    _.assign(
      {
        name: escapeName(templateData.contributor.name),
        avatar,
      },
      templateData,
    ),
  )

  return contributorTemplate(_.assign({avatarBlock}, templateData))
}

function escapeName(name) {
  return name.replace(new RegExp('\\|', 'g'), '&#124;')
}

module.exports = function formatContributor(options, contributor) {
  const formatter = _.partial(formatContributionType, [options, contributor])
  const contributions = contributor.contributions.map(formatter).join(' ')
  const templateData = {
    contributions,
    contributor,
    options: _.assign({imageSize: defaultImageSize}, options),
  }
  const customTemplate =
    options.contributorTemplate && _.template(options.contributorTemplate)
  return (customTemplate || defaultTemplate)(templateData)
}
