import React from "react";
import Autosuggest from "react-autosuggest";
import {
  TextField,
  Paper,
  Popper,
  withStyles,
  createStyles,
  RootRef
} from "@material-ui/core";

const styles = theme =>
  createStyles({
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: "none"
    }
  });

const languages = [
  {
    name: "C",
    year: 1972
  },
  {
    name: "Elm",
    year: 2012
  },
  {
    name: "Elmo",
    year: 2013
  },
  {
    name: "Ren",
    year: 2014
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  console.log(inputLength, languages);

  return inputLength === 0
    ? languages
    : languages.filter(
        lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

const renderSuggestionsContainer = popperNode => ({
  containerProps,
  children,
  query
}) => {
  console.log(children);

  const { ref, ...rest } = containerProps;

  return (
    <RootRef
      rootRef={node => {
        ref(node);
      }}
    >
      <Popper
        anchorEl={popperNode}
        open={true}
        style={{ zIndex: 1400, maxHeight: "50px", overflowY: "auto" }}
      >
        <Paper
          square
          {...rest}
          style={{
            width: popperNode ? popperNode.clientWidth : null
          }}
        >
          {children}
        </Paper>
      </Popper>
    </RootRef>
  );
};

const renderInputComponent = inputProps => {
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    inputRef,
    ref,
    ...rest
  } = inputProps;

  console.log("input: ", value);

  return (
    <TextField
      anima
      label="Hej"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      InputLabelProps={{ shrink: true }}
      inputRef={node => {
        inputRef(node);
        ref(node);
      }}
      inputProps={rest}
    />
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion, { query, isHighlighted }) => (
  <div style={{ backgroundColor: isHighlighted ? "teal" : "red" }}>
    {suggestion.name}
  </div>
);

class Autocomplete extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value, reason }) => {
    this.setState({
      suggestions:
        reason === "input-focused" ? languages : getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onFocus = () => {
    this.setState({ value: "", suggestions: languages });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      value,
      onChange: this.onChange,
      onFocus: this.onFocus,
      inputRef: node => {
        this.popperNode = node;
      }
    };

    // Finally, render it!
    return (
      <Autosuggest
        theme={{
          suggestionsList: this.props.classes.suggestionsList,
          suggestion: this.props.classes.suggestion
        }}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        shouldRenderSuggestions={() => true}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer(this.popperNode)}
      />
    );
  }
}

export default withStyles(styles)(Autocomplete);
