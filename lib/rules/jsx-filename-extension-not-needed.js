/**
 * @fileoverview Restrict file extensions that may contain JSX
 * @author Joe Lencioni
 */

'use strict';

const path = require('path');
const docsUrl = require('../util/docsUrl');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DEFAULTS = {
  extensions: ['.jsx']
};

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Requier that .jsx file extensions must contain JSX',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-filename-extension-not-needed')
    },

    schema: [{
      type: 'object',
      properties: {
        extensions: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      },
      additionalProperties: false
    }]
  },

  create(context) {
    let invalidExtension;
    let invalidNode;

    function getExtensionsConfig() {
      return context.options[0] && context.options[0].extensions || DEFAULTS.extensions;
    }

    function checkIfReactIsInScope(node) {
      console.log('checkIfReactIsInScope');
      const variables = variableUtil.variablesInScope(context);
      if (variableUtil.findVariable(variables, pragma)) {
        return;
      }
      context.report({
        node,
        message: NOT_DEFINED_MESSAGE,
        data: {
          name: pragma
        }
      });
    }

    function handleJSX(node) {
      const filename = context.getFilename();
      console.log('filename', filename);
      if (filename === '<text>') {
        return;
      }

      if (invalidNode) {
        return;
      }

      const allowedExtensions = getExtensionsConfig();
      const isAllowedExtension = allowedExtensions.some((extension) => filename.slice(-extension.length) === extension);

      if (isAllowedExtension) {
        return;
      }

      invalidNode = node;
      console.log('invalidNode', invalidNode);
      invalidExtension = path.extname(filename);
      console.log('invalidExtension', invalidExtension);
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      ASTNode: checkIfReactIsInScope,
      JSXElement: handleJSX,

      'Program:exit'() {
        // console.log('invalidNode', invalidNode);
        if (!invalidNode) {
          return;
        }

        context.report({
          node: invalidNode,
          // loc: 0,
          message: `JSX not allowed in files with extension '${invalidExtension}'`
        });
      }
    };
  }
};
