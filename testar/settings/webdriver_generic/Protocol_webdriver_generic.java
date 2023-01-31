import es.upv.staq.testar.NativeLinker;
import es.upv.staq.testar.protocols.ClickFilterLayerProtocol;
import nl.ou.testar.SutVisualization;
import org.fruit.Pair;
import org.fruit.alayer.*;
import org.fruit.alayer.actions.*;
import org.fruit.alayer.exceptions.ActionBuildException;
import org.fruit.alayer.exceptions.StateBuildException;
import org.fruit.alayer.exceptions.SystemStartException;
import org.fruit.alayer.webdriver.*;
import org.fruit.alayer.webdriver.enums.WdRoles;
import org.fruit.alayer.webdriver.enums.WdTags;
import org.fruit.monkey.ConfigTags;
import org.fruit.monkey.Settings;
import org.testar.protocols.WebdriverProtocol;

import java.util.*;

import static org.fruit.alayer.Tags.Blocked;
import static org.fruit.alayer.Tags.Enabled;
import static org.fruit.alayer.webdriver.Constants.scrollArrowSize;
import static org.fruit.alayer.webdriver.Constants.scrollThick;

public class Protocol_webdriver_generic extends WebdriverProtocol {

	@Override
	protected void initialize(Settings settings) {
		super.initialize(settings);

		policyAttributes = new HashMap<String, String>() {{
			put("class", "lfr-btn-label");
		}};
	}

	@Override
	protected SUT startSystem() throws SystemStartException {
		return super.startSystem();
	}

	@Override
	protected void beginSequence(SUT system, State state) {
		super.beginSequence(system, state);
	}

	@Override
	protected State getState(SUT system) throws StateBuildException {
		State state = super.getState(system);

		return state;
	}

	@Override
	protected Verdict getVerdict(State state) {

		Verdict verdict = super.getVerdict(state);

		return verdict;
	}

	@Override
	protected Set<Action> deriveActions(SUT system, State state) throws ActionBuildException {

		Set<Action> actions = super.deriveActions(system, state);
		Set<Action> filteredActions = new HashSet<>();

		StdActionCompiler ac = new AnnotatingActionCompiler();

		Set<Action> forcedActions = detectForcedActions(state, ac);

		for (Widget widget : state) {

			if (!widget.get(Enabled, true)) {
				continue;
			}

			if(blackListed(widget)){
				if(isTypeable(widget)){
					filteredActions.add(ac.clickTypeInto(widget, this.getRandomText(widget), true));
				} else {
					filteredActions.add(ac.leftClickAt(widget));
				}
				continue;
			}

			addSlidingActions(actions, ac, scrollArrowSize, scrollThick, widget);

			if (widget.get(Blocked, false) && !widget.get(WdTags.WebIsShadow, false)) {
				continue;
			}

			if (isAtBrowserCanvas(widget) && isTypeable(widget)) {
				if(whiteListed(widget) || isUnfiltered(widget)){
					actions.add(ac.clickTypeInto(widget, this.getRandomText(widget), true));
				}else{

					filteredActions.add(ac.clickTypeInto(widget, this.getRandomText(widget), true));
				}
			}

			if (isAtBrowserCanvas(widget) && isClickable(widget)) {
				if(whiteListed(widget) || isUnfiltered(widget)){
					if (!isLinkDenied(widget)) {
						actions.add(ac.leftClickAt(widget));
					}else{

						filteredActions.add(ac.leftClickAt(widget));
					}
				}else{

					filteredActions.add(ac.leftClickAt(widget));
				}
			}
		}

		if (forcedActions != null && forcedActions.size() > 0) {
			filteredActions = actions;
			actions = forcedActions;
		}

		if(visualizationOn || mode() == Modes.Spy) SutVisualization.visualizeFilteredActions(cv, state, filteredActions);

		return actions;
	}

	@Override
	protected boolean isClickable(Widget widget) {
		Role role = widget.get(Tags.Role, Roles.Widget);
		if (Role.isOneOf(role, NativeLinker.getNativeClickableRoles())) {

			if (role.equals(WdRoles.WdINPUT)) {
				String type = ((WdWidget) widget).element.type;
				return WdRoles.clickableInputTypes().contains(type);
			}
			return true;
		}

		WdElement element = ((WdWidget) widget).element;
		if (element.isClickable) {
			return true;
		}

		Set<String> clickSet = new HashSet<>(clickableClasses);
		clickSet.retainAll(element.cssClasses);
		return clickSet.size() > 0;
	}

	@Override
	protected boolean isTypeable(Widget widget) {
		Role role = widget.get(Tags.Role, Roles.Widget);
		if (Role.isOneOf(role, NativeLinker.getNativeTypeableRoles())) {

			if (role.equals(WdRoles.WdINPUT)) {
				String type = ((WdWidget) widget).element.type;
				return WdRoles.typeableInputTypes().contains(type);
			}
			return true;
		}

		return false;
	}

	@Override
	protected Action selectAction(State state, Set<Action> actions) {
		return super.selectAction(state, actions);
	}

	@Override
	protected boolean executeAction(SUT system, State state, Action action) {
		return super.executeAction(system, state, action);
	}

	@Override
	protected boolean moreActions(State state) {
		return super.moreActions(state);
	}

	@Override
	protected void finishSequence() {
		super.finishSequence();
	}

	@Override
	protected boolean moreSequences() {
		return super.moreSequences();
	}
}